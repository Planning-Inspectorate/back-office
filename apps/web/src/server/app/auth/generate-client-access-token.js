import NodeCache from 'node-cache';
import logger from '../../lib/logger.js';
import { acquireTokenByClientCredential } from './auth.service.js';

export const nodeCache = new NodeCache();

export const getAccessToken = async () => {
	logger.info('attempting to generate access token from cache');

	let accessToken = nodeCache.get('access_token');

	if (accessToken) {
		logger.info('successfuly generated access token from cache');
		return accessToken;
	}

	try {
		logger.info('attempting to generate access token from client');

		// Make a request to the token endpoint to generate a new token
		const { accessToken: generatedAccessToken, expiresOn } =
			(await acquireTokenByClientCredential()) || {};

		logger.info('successfuly generated access token from client');

		// @ts-ignore
		nodeCache.set('access_token', generatedAccessToken, expiresOn?.getTime());

		logger.info('set generated access token into cache');

		accessToken = generatedAccessToken;
	} catch (error) {
		logger.error('error accured while generating access token', error);
		throw error;
	}

	return accessToken;
};
