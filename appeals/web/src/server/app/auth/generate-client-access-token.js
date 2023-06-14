import { fetchFromCache, storeInCache } from '../../lib/cache-handler.js';
import logger from '../../lib/logger.js';
import { acquireTokenByClientCredential } from './auth.service.js';

/**
 * @async
 * @function generateAccessTokenFromClient
 * @returns {Promise<string>} - A string containing the generated access token.
 * @description An asynchronous function that generates an access token from the client and caches it.
 * The function calls the `acquireTokenByClientCredential` function to generate an access token, and logs a success message if the token was generated successfully.
 * The `storeInCacheTTL` function is used to calculate the cache Time To Live (TTL) value from the `expiresOn` value returned from `acquireTokenByClientCredential`.
 * The `storeInCache` function is then called to set the generated access token in the cache with the calculated TTL.
 * Finally, the generated access token is returned in a string.
 */
async function generateAccessTokenFromClient() {
	const { accessToken: generatedAccessToken, expiresOn } =
		(await acquireTokenByClientCredential()) || {};

	if (!generatedAccessToken) {
		throw new Error('there was an issue generating an access token from client');
	}

	logger.info('successfuly generated access token from client');

	storeInCache('access_token', generatedAccessToken, expiresOn?.getTime());

	return generatedAccessToken;
}

/**
 * @async
 * @function getAccessToken
 * @description An async function that returns the access token.
 * It first tries to retrieve the access token from cache, if it is not available,
 * then it makes a request to generate a new access token.
 * @returns {Promise<string>} The generated access token
 * @throws {Error} If an error occurs while generating the access token.
 */
export async function getAccessToken() {
	logger.info('attempting to generate access token from cache');

	let accessToken;

	try {
		accessToken = await fetchFromCache('access_token');

		if (accessToken) {
			return accessToken;
		}

		logger.info('attempting to generate access token from client');

		// Make a request to the token endpoint to generate a new token
		const generatedAccessToken = await generateAccessTokenFromClient();

		accessToken = generatedAccessToken;
	} catch (error) {
		logger.error('error accured while generating access token', error);
		throw error;
	}

	return accessToken;
}
