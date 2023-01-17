import { acquireTokenSilent } from '../app/auth/auth.service.js';
import { getAccount } from '../app/auth/auth-session.service.js';
import pino from './logger.js';

/** @typedef {import('../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('@azure/msal-node').AuthenticationResult} AuthenticationResult */

/**
 * Get the Azure Active Directory access token using logged account credentials
 *
 * @param {SessionWithAuth} session
 * @returns {Promise<AccessToken>}
 */
const getActiveDirectoryAccessToken = async (session) => {
	const sessionAccount = getAccount(session);

	if (!sessionAccount) {
		throw new Error('Session account not found');
	}

	/** @type {AuthenticationResult | null} * */
	const blobResourceAuthResult = await acquireTokenSilent(sessionAccount, [
		'https://storage.azure.com/user_impersonation'
	]);

	if (!blobResourceAuthResult?.accessToken || !blobResourceAuthResult?.expiresOn) {
		throw new Error('Active Directory access token not found');
	}

	const { accessToken, expiresOn } = blobResourceAuthResult;

	pino.info('access token from utility func:');
	pino.info(accessToken);
	pino.info(expiresOn);

	return { token: accessToken, expiresOnTimestamp: new Date(expiresOn).getTime() };
};

export default getActiveDirectoryAccessToken;
