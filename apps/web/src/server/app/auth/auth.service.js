import config from '@pins/applications.web/environment/config.js';
import humps from 'humps';
import { msalClient } from '../../lib/msal.js';

/** @typedef {import('@azure/msal-node').AuthenticationResult} OriginalAuthenticationResult */
/** @typedef {import('@pins/platform').PlanningInspectorAccountInfo} AccountInfo */
/** @typedef {import('@pins/platform').MsalAuthenticationResult} AuthenticationResult */

const scopes = ['user.read'];

/**
 * Acquire a {@link AuthenticationResult} using a code sourced from the user
 * having signed in manually at a MSAL authentication url.
 *
 * @param {string} code
 * @returns {Promise<AuthenticationResult | null>}
 */
export const acquireTokenByCode = async (code) => {
	return transformAuthenticationResult(
		await msalClient.acquireTokenByCode({
			authority: config.msal.authority,
			code,
			redirectUri: config.msal.redirectUri,
			scopes
		})
	);
};

/**
 * Acquire a new {@link AuthenticationResult} using an account. Note that
 * `acquireTokenSilent` will use a cached access token where posisble, and only
 * use a network request as a last resort.
 *
 * @param {AccountInfo} account
 * @param {string[]} customScopes
 * @returns {Promise<AuthenticationResult | null>}
 */
export const acquireTokenSilent = async (account, customScopes = scopes) => {
	return transformAuthenticationResult(
		await msalClient.acquireTokenSilent({
			account,
			scopes: customScopes
		})
	);
};

/**
 * Clear the token cache of all accounts/access tokens. This will force the
 * msalClient to renegotiate authentication via a network request. To be used
 * when signing a user out.
 *
 * @param {AccountInfo} account
 * @returns {Promise<void>}
 */
export const clearCacheForAccount = async (account) => {
	await msalClient.getTokenCache().removeAccount(account);
};

/**
 * Obtain a url for the user to sign in using MSAL authentication. This url is
 * scoped to the application via the `nonce` property.
 *
 * @param {{ nonce: string }} options
 * @returns {Promise<string>}
 */
export const getAuthCodeUrl = (options) => {
	return msalClient.getAuthCodeUrl({
		...options,
		authority: config.msal.authority,
		redirectUri: config.msal.redirectUri,
		scopes
	});
};

/**
 * @param {OriginalAuthenticationResult | null} authenticationResult
 * @returns {AuthenticationResult | null}
 */
function transformAuthenticationResult(authenticationResult) {
	if (authenticationResult?.account) {
		// camelize incoming keys to align casing with that of the codebase
		// (otherwise, snake-cased properties are in play that mess with eslint)
		return {
			...authenticationResult,
			account: /** @type {AccountInfo} */ (humps.camelizeKeys(authenticationResult.account))
		};
	}
	return null;
}
