import msalNode from '@azure/msal-node';
import { CryptoUtils, ensureAbsoluteUrl } from '@pins/platform';
import { config } from '../../config/config.js';
import { msalClient } from '../../lib/sso.js';

/** @typedef {import('@pins/express').Auth.AuthCodeParams} AuthCodeParams */

const cryptoProvider = new msalNode.CryptoProvider();
const cryptoUtils = new CryptoUtils();

/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
const AppStages = {
	SIGN_IN: 'sign_in',
	SIGN_OUT: 'sign_out',
	ACQUIRE_TOKEN: 'acquire_token'
};

/**
 * This method is used to generate an auth code url request
 *
 * @param {import('express').Request} request express request object
 * @param {import('express').Response} response express response object
 * @param {import('express').NextFunction} next express next function
 * @param {AuthCodeParams} params modifies auth code url request
 */
async function getAuthCode(request, response, next, params) {
	// Prepare the request
	request.session.authCodeRequest = {
		authority: params.authority,
		scopes: params.scopes,
		state: params.state,
		redirectUri: params.redirect,
		prompt: params.prompt,
		account: params.account
	};

	request.session.tokenRequest = {
		authority: params.authority,
		scopes: params.scopes,
		redirectUri: params.redirect,
		code: undefined
	};

	// Request an authorization code to exchange for tokens
	try {
		const msalRedirectURL = await msalClient.getAuthCodeUrl(request.session.authCodeRequest);
		response.redirect(msalRedirectURL);
	} catch (error) {
		console.error('Authorization code cannot be obtained');
		next(error);
	}
}

/**
 * Initiates sign in flow
 *
 * @param {import('express').Request} request express request object
 * @param {import('express').Response} response express response object
 * @param {import('express').NextFunction} next express next function
 */
export function authSignIn(request, response, next) {
	const key = cryptoUtils.createKey(request.session.nonce, cryptoUtils.generateSalt());
	request.session.key = key.toString('hex');

	const state = cryptoProvider.base64Encode(
		cryptoUtils.encryptData(
			JSON.stringify({
				stage: AppStages.SIGN_IN,
				path: request.query.redirect_to ?? '/',
				nonce: request.session.nonce
			}),
			key
		)
	);

	/** @type {AuthCodeParams} */
	const params = {
		authority: `${config.auth.sso.cloudInstanceId}/${config.auth.sso.tenantId}`,
		scopes: ['user.read'],
		state: state,
		redirect: ensureAbsoluteUrl(request, config.auth.redirectUri)
	};

	// Get url to sign user in
	return getAuthCode(request, response, next, params);
}

/**
 * Middleware that handles redirect depending on request state
 * There are basically 2 stages: sign-in and acquire token.
 *
 * @param {import('express').Request} request express request object
 * @param {import('express').Response} response express response object
 * @param {import('express').NextFunction} next express next function
 */
export async function handleRedirect(request, response, next) {
	if (request.query.state) {
		const state = JSON.parse(cryptoUtils.decryptData(cryptoProvider.base64Decode(request.query.state), Buffer.from(request.session.key, 'hex')));

		// Check if nonce matches
		if (state.nonce === request.session.nonce) {
			switch (state.stage) {
				case AppStages.SIGN_IN: {
					// Token request should have auth code
					request.session.tokenRequest.code = request.query.code;

					try {
						// Exchange auth code for tokens
						const tokenResponse = await msalClient.acquireTokenByCode(request.session.tokenRequest);
						request.session.isAuthenticated = true;
						request.session.account = tokenResponse.account;

						response.redirect(state.path);
					} catch (error) {
						console.error('Token acquisition failed');
						next(error);
					}
					break;
				}

				// case AppStages.ACQUIRE_TOKEN: {
				// TODO: Add implementation if needed.
				// }

				default:
					console.error('Cannot determine application stage');
					response.redirect('auth/error');
					break;
			}
		} else {
			console.error('Nonce does not match');
			response.redirect('auth/unauthorized');
		}
	} else {
		console.error('State not found');
		response.redirect('auth/unauthorized');
	}
}

/**
 * View the unauthorized error page.
 *
 * @param {import('express').Request} request express request object
 * @param {import('express').Response} response express response object
 */
export function viewAuthUnauthorized(request, response) {
	response.status(401).render('auth/unauthorized');
}

/**
 * View the generic error page.
 *
 * @param {import('express').Request} request express request object
 * @param {import('express').Response} response express response object
 */
export function viewAuthError(request, response) {
	response.status(500).render('auth/error');
}
