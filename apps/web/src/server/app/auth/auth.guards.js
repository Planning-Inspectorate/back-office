import { checkAccessRule } from '../../lib/sso.js';

/** @typedef {import('@pins/express').Auth.GuardOptions} GuardOptions */

/**
 * Path to redirect to after successful login.
 *
 * @type {import('@pins/express').RequestHandler}
 */
// eslint-disable-next-line consistent-return
export function isAuthenticated(request, response, next) {
	if (request.session) {
		if (!request.session.isAuthenticated) {
			console.error('Not permitted');
			// return response.redirect('/auth/unauthorized');
			return response.redirect(`/auth/signin?redirect_to=${request.originalUrl}`);
		}

		next();
	} else {
		console.error('No session found for this request');
		response.redirect('/auth/unauthorized');
	}
}

/**
 * Checks if the user has access for this route, defined in access matrix
 *
 * @template {object} T
 * @param {GuardOptions} options options to modify this middleware
 * @returns {import('express').RequestHandler<T>} - A wrapped request handler.
 */
export function hasAccess(options) {
	// eslint-disable-next-line consistent-return
	return (request, response, next) => {
		if (request.session) {
			const checkFor = options.accessRule?.hasOwnProperty('groups') ? 'groups' : 'roles';

			switch (checkFor) {
				case 'groups':

					if (request.session.account.idTokenClaims.groups === undefined) {
						if (request.session.account.idTokenClaims._claim_name || request.session.account.idTokenClaims._claim_sources) {
							console.warn('User has too many groups. Groups overage claim occurred');

							// TODO: Should we handle overage?
							response.redirect('/auth/unauthorized');
						} else {
							console.error('User does not have any groups');
							return response.redirect('/auth/unauthorized');
						}
					} else {
						const groups = request.session.account.idTokenClaims.groups;

						if (!checkAccessRule(request.method, options.accessRule, groups, 'groups')) {
							return response.redirect('/auth/unauthorized');
						}
					}

					next();
					break;

				case 'roles':
					if (request.session.account.idTokenClaims.roles === undefined) {
						console.error('User does not have any roles');
						return response.redirect('/auth/unauthorized');
					} else {
						const roles = request.session.account.idTokenClaims.roles;

						if (!checkAccessRule(request.method, options.accessRule, roles, 'roles')) {
							return response.redirect('/auth/unauthorized');
						}
					}

					next();
					break;

				default:
					break;
			}
		} else {
			response.redirect('/auth/unauthorized');
		}
	};
}
