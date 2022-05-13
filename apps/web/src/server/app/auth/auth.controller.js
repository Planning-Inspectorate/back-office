import { UrlString } from '@azure/msal-common';
import msalNode from '@azure/msal-node';
import { CryptoUtils } from '@pins/platform';
import config from '@pins/web/environment/config.js';
import humps from 'humps';
import pino from '../../lib/logger.js';
import { msalClient } from '../../lib/sso.js';

/** @typedef {import('@pins/platform').PlanningInspectorAccountInfo} AccountInfo */

/**
 * @typedef {object} AuthCodeParams
 * @property {string} authority
 * @property {string[]} scopes
 * @property {string} state
 * @property {string} redirect
 * @property {string=} prompt
 * @property {AccountInfo=} account
 */

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
 * @param {AuthCodeParams} parameters modifies auth code url request
 */
async function getAuthCode(request, response, next, parameters) {
	// Prepare the request
	request.session.authCodeRequest = {
		authority: parameters.authority,
		scopes: parameters.scopes,
		state: parameters.state,
		redirectUri: parameters.redirect,
		prompt: parameters.prompt,
		account: parameters.account
	};

	request.session.tokenRequest = {
		authority: parameters.authority,
		scopes: parameters.scopes,
		redirectUri: parameters.redirect,
		code: ''
	};

	// Request an authorization code to exchange for tokens
	try {
		const msalRedirectURL = await msalClient.getAuthCodeUrl(request.session.authCodeRequest);

		response.redirect(msalRedirectURL);
	} catch (error) {
		pino.error(error, 'Authentication failed. MSAL Authentication code could not be obtained.');
		next(error);
	}
}

/**
 * Gets the absolute URL from a given request and path string
 *
 * @param {import('express').Request} request
 * @param {string} url
 * @returns {string}
 */
export function ensureAbsoluteUrl(request, url) {
	const urlComponents = new UrlString(url).getUrlComponents();

	if (!urlComponents.Protocol) {
		if (!urlComponents.HostNameAndPort && !url.startsWith('www')) {
			const path = url.startsWith('/') ? url : `/${url}`;

			return `${request.protocol}://${request.get('host')}${path}`;
		}
		return `${request.protocol}://${url}`;
	}
	return url;
}

/** @type {import('express').RequestHandler} */
export function authSignIn(request, response, next) {
	const key = cryptoUtils.createKey(
		/** @type {string} */ (request.session.nonce),
		cryptoUtils.generateSalt()
	);

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
	const parameters = {
		authority: `${config.auth.sso.cloudInstanceId}/${config.auth.sso.tenantId}`,
		scopes: ['user.read'],
		state,
		redirect: ensureAbsoluteUrl(request, config.auth.redirectUri)
	};

	// Get url to sign user in
	getAuthCode(request, response, next, parameters);
}

/**
 * Middleware that handles redirect depending on request state
 * There are basically 2 stages: sign-in and acquire token.
 *
 * @type {import('express').RequestHandler}
 */
export async function handleRedirect(request, response, next) {
	if (
		request.query.state &&
		request.query.code &&
		request.session.key &&
		request.session.tokenRequest
	) {
		const state = JSON.parse(
			cryptoUtils.decryptData(
				cryptoProvider.base64Decode(/** @type {string} */ (request.query.state)),
				Buffer.from(request.session.key, 'hex')
			)
		);

		// Check if nonce matches
		if (state.nonce === request.session.nonce) {
			switch (state.stage) {
				case AppStages.SIGN_IN: {
					// Token request should have auth code
					request.session.tokenRequest.code = /** @type {string} */ (request.query.code);

					try {
						// Exchange auth code for tokens

						const tokenResponse = await msalClient.acquireTokenByCode(request.session.tokenRequest);

						if (tokenResponse?.account) {
							request.session.isAuthenticated = true;
							request.session.account =
								/** @type {import('@pins/platform').PlanningInspectorAccountInfo} */ (
									humps.camelizeKeys(tokenResponse.account)
								);
							response.redirect(state.path);
						}
					} catch (error) {
						pino.error(error, 'Authentication failed. Could not acquire token.');
						next(error);
					}
					break;
				}

				default:
					pino.error({ state }, 'Authentication failed. Could not determine application stage.');
					response.redirect('/auth/error');
					break;
			}
		} else {
			pino.error(
				{ actual: request.session.nonce, expected: state.nonce },
				'Authentication failed. Nonce did not match.'
			);
			response.redirect('/auth/unauthorized');
		}
	} else {
		pino.error(
			{
				key: request.session.key,
				msalAuthCode: request.query.code,
				msalState: request.query.state,
				tokenRequest: request.session.tokenRequest
			},
			'Authentication failed. Required data is missing or incorrect.'
		);
		response.redirect('/auth/unauthorized');
	}
}

/**
 * View the unauthorized error page.
 *
 * @param {import('express').Request} request express request object
 * @param {import('express').Response} response express response object
 */
export function viewAuthUnauthorized(request, response) {
	response.status(200).render('auth/unauthorized');
}

/**
 * View the generic error page.
 *
 * @param {import('express').Request} request express request object
 * @param {import('express').Response} response express response object
 */
export function viewAuthError(request, response) {
	response.status(200).render('auth/error');
}
