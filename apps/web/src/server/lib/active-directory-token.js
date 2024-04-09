import { acquireTokenSilent } from '../app/auth/auth.service.js';
import { getAccount } from '../app/auth/auth-session.service.js';
import config from '../../../environment/config.js';

/** @typedef {import('../app/auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('@azure/msal-node').AuthenticationResult} AuthenticationResult */

/**
 * Get the Azure Active Directory access token using logged account credentials
 *
 * @param {SessionWithAuth} session
 * @param {Array<string>} customScopes
 * @returns {Promise<AccessToken>}
 */
const getActiveDirectoryAccessToken = async (
	session,
	customScopes = ['https://storage.azure.com/user_impersonation']
) => {
	// Return a fake access token when auth is disabled so that uploads and downloads can skip blob storage functionality when developing locally
	if (config.authDisabled) {
		return { token: 'AUTH_DISABLED', expiresOnTimestamp: 0 };
	}

	const sessionAccount = getAccount(session);

	if (!sessionAccount) {
		throw new Error('Session account not found');
	}

	/** @type {{accessToken: string, expiresOn: any} | null} * */
	const blobResourceAuthResult = await acquireTokenSilent(sessionAccount, session.id, customScopes);

	if (!blobResourceAuthResult?.accessToken) {
		throw new Error('Active Directory access token not found');
	}

	const { accessToken, expiresOn } = blobResourceAuthResult;

	return { token: accessToken, expiresOnTimestamp: expiresOn };
};

export default getActiveDirectoryAccessToken;
