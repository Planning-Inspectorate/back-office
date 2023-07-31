import { acquireTokenSilent } from '../app/auth/auth.service.js';
import { getAccount } from '../app/auth/auth-session.service.js';

/** @typedef {import('../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('@azure/msal-node').AuthenticationResult} AuthenticationResult */

/**
 * Get the Azure Active Directory access token using logged account credentials
 *
 * @param {SessionWithAuth} session
 * @returns {Promise<AccessToken>}
 */
const getActiveDirectoryAccessToken = async (
	session,
	customScopes = ['https://storage.azure.com/user_impersonation']
) => {
	const sessionAccount = getAccount(session);

	if (!sessionAccount) {
		throw new Error('Session account not found');
	}

	/** @type {{accessToken: string, expiresOn: any} | null} * */
	const resourceAuthResult = await acquireTokenSilent(sessionAccount, customScopes);

	if (!resourceAuthResult?.accessToken) {
		throw new Error('Active Directory access token not found');
	}

	const { accessToken, expiresOn } = resourceAuthResult;

	return { token: accessToken, expiresOnTimestamp: expiresOn };
};

export default getActiveDirectoryAccessToken;
