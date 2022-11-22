import pino from '../../lib/logger.js';
import * as authService from './auth.service.js';
import * as authSession from './auth-session.service.js';

/**
 * Assert the user is authenticated. As the web application depends on external
 * authentication via MSAL, then the presence of an account alone in the session
 * is not sufficient to say the user is still authenticated: The validity of the
 * access token associated with that account must frequently be evaluated
 * against MSAL.
 *
 * As the typical lifetime of an access token is 60 - 75 minutes, it must be
 * refreshed silently to avoid the user having to directly reauthenticate. As a
 * consequence, this guard will silently refresh the authentication result using
 * the refresh token held internally by the @azure/msal-node package. (This
 * refresh token has a longer expiry duration of about one day).
 *
 * The user is ultimately considered authenticated with the application if the
 * existing authentication result could be silently refreshed.
 *
 * @type {import('express').RequestHandler}
 */
export async function assertIsAuthenticated(request, response, next) {
	const sessionAccount = authSession.getAccount(request.session);

	if (sessionAccount) {
		try {
			// Eagerly invoke the `acquireTokenSilent` method: Internally,
			// @azure/msal-node will evaluate if the access token has (or is close to)
			// expired on the existing authentication result, and only then make a
			// network call with the refresh token to acquire a new authentication
			// result.
			const refreshedAuthenticationResult = await authService.acquireTokenSilent(sessionAccount);

			if (refreshedAuthenticationResult) {
				pino.debug('Refreshed MSAL authentication.');
				authSession.setAccount(request.session, refreshedAuthenticationResult);
				return next();
			}
			// Destroy current session if refreshedAuthenticationResult not provided.
			// pino.info(`Session destroyed '${refreshedAuthenticationResult}'.`);
			// await Promise.all([
			// 	promisify(request.session.destroy.bind(request.session))(),
			// 	authService.clearCacheForAccount(account)
			// ]);
			// response.clearCookie('connect.sid', { path: '/' }).redirect('/auth/signout/');
			pino.info(`Log user out '${refreshedAuthenticationResult}'.`);
			response.redirect('/auth/signout/');
		} catch (error) {
			pino.info(error, 'Failed to refresh MSAL authentication.');
		}
	}
	pino.info(`Unauthenticated user redirected to sign in from '${request.originalUrl}'.`);
	response.redirect(`/auth/signin?redirect_to=${request.originalUrl}`);
}

/**
 * Assert the user is unauthenticated.
 *
 * @type {import('express').RequestHandler}
 */
export function assertIsUnauthenticated({ session }, response, next) {
	if (!authSession.getAccount(session)) {
		next();
	} else {
		response.redirect(`/`);
	}
}

/**
 * Assert that the user's authenticated account has access to the provided groups.
 *
 * @param  {...string} groupIds
 * @returns {import('express').RequestHandler}
 */
export function assertGroupAccess(...groupIds) {
	return (req, res, next) => {
		const account = authSession.getAccount(req.session);

		if (account?.idTokenClaims.groups) {
			for (const groupId of groupIds) {
				if (groupId && account.idTokenClaims.groups.includes(groupId)) {
					return next();
				}
			}
			pino.warn(
				{ actual: account?.idTokenClaims.groups, expected: groupIds },
				'Authorisation failed. User does not belong to any of the expected groups.'
			);
			return res.render('app/403');
		}
		if (account?.idTokenClaims.claimName || account?.idTokenClaims.claimSources) {
			// TODO: Should we handle overage?
			pino.error('Authorisation error. User has too many groups: groups overage claim occurred.');
		} else {
			pino.warn('Authorisation error. User does not belong to any groups.');
		}
		res.render('app/403');
	};
}
