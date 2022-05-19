/** @typedef {import('express-session').Session & AuthState} SessionWithAuth */
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
	session.account = account;
};

/**
 * @param {SessionWithAuth} session
 * @returns {AccountInfo=}
 */
export const getAccount = (session) => {
	return session.account;
};
