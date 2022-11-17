import pino from '../../lib/logger.js';

/** @typedef {import('express-session').Session & AuthState} SessionWithAuth */
/** @typedef {import('express-session').Session & {accessToken: AccessToken}} SessionWithAccessToken */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('./auth.service').AccountInfo} AccountInfo */

/**
 * @typedef {object} AuthenticationData
 * @property {string} nonce
 * @property {string} postSigninRedirectUri
 */

/**
 * @typedef {object} AuthState
 * @property {AccountInfo=} account
 * @property {AuthenticationData=} authenticationData
 */

/**
 * @param {SessionWithAuth} session
 * @returns {void}
 */
export const destroyAuthenticationData = (session) => {
	delete session.authenticationData;
};

/**
 * @param {SessionWithAuth} session
 * @returns {AuthenticationData}
 */
export const getAuthenticationData = (session) => {
	if (session.authenticationData) {
		return session.authenticationData;
	}
	throw new Error('Authentication does not exist.');
};

/**
 * @param {SessionWithAuth} session
 * @param {AuthenticationData} data
 * @returns {void}
 */
export const setAuthenticationData = (session, data) => {
	session.authenticationData = data;
};

/**
 * @param {SessionWithAuth} session
 * @returns {void}
 */
export const destroyAccount = (session) => {
	delete session.account;
};

/**
 * @param {SessionWithAuth} session
 * @param {AccountInfo} account
 * @returns {void}
 */
export const setAccount = (session, account) => {
	pino.info(`[WEB] account being set: ${account.accessToken}`);

	session.account = account;

	pino.info(`[WEB] account just set: ${session.account.accessToken}`);
};

/**
 * @param {SessionWithAuth} session
 * @returns {AccountInfo=}
 */
export const getAccount = (session) => {
	return session.account;
};

/**
 * @param {SessionWithAccessToken} session
 * @param {*} accessToken
 * @returns {void}
 */
export const setAccessToken = (session, accessToken) => {
	session.accessToken = accessToken;
};

/**
 * @param {SessionWithAccessToken} session
 * @returns {*}
 */
export const getAccessToken = (session) => {
	return session.accessToken;
};

// TODO: create destroy accesstoken method and execute on logout
