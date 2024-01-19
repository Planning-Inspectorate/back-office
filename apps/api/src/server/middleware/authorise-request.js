import BackOfficeAppError from '#utils/app-error.js';
import { getCache, setCache } from '#utils/cache-data.js';
import { fetchApiKey } from '#utils/fetch-api-key.js';
import logger from '#utils/logger.js';

/**
 * @type {import('express').RequestHandler}
 */
export const authoriseRequest = async (request, _response, next) => {
	const callingClient = request.headers['x-service-name'];
	const incomingRequestApiKey = request.headers['x-api-key'];

	if (!callingClient) {
		throw new BackOfficeAppError("No 'x-service-name' header found on request", 400);
	}
	if (!incomingRequestApiKey) {
		throw new BackOfficeAppError(`No API key present on request from ${callingClient}`, 403);
	}

	logger.info(`Request received from ${callingClient}`);
	const callingClientApiKeyName = callingClient + '-api-key';
	if (!getCache(callingClientApiKeyName)) {
		const callingClientApiKey = await fetchApiKey(callingClientApiKeyName);
		const lessThanHourTtl = 3540;
		setCache(callingClientApiKeyName, callingClientApiKey, lessThanHourTtl);
	}

	if (isRequestApiKeyValid(incomingRequestApiKey, callingClientApiKeyName)) {
		logger.info(`Request from ${callingClient} authenticated`);
		next();
	} else {
		throw new BackOfficeAppError(
			`Could not authenticate request from ${callingClient} - invalid API key`
		);
	}
};

/**
 * @param {string} incomingRequestApiKey
 * @param {string} cachedApiKeyAddress
 */
const isRequestApiKeyValid = (incomingRequestApiKey, cachedApiKeyAddress) => {
	const apiKeyPair = getCache(cachedApiKeyAddress);
	const newestApiKey = apiKeyPair.find((key) => key.status === 'newest');
	const oldestApiKey = apiKeyPair.find((key) => key.status === 'oldest');

	if (incomingRequestApiKey === newestApiKey.key) {
		return true;
	}
	if (incomingRequestApiKey === oldestApiKey.key && isOldestKeyStillValid(oldestApiKey)) {
		return true;
	}
	if (incomingRequestApiKey === oldestApiKey.key && !isOldestKeyStillValid(oldestApiKey)) {
		// Set up alerting for Application Insights
		throw new BackOfficeAppError('Expired API key used');
	}
	return false;
};

/**
 * @param {Object} oldestApiKey
 */
const isOldestKeyStillValid = (oldestApiKey) => {
	const currentTime = new Date();
	const expiryTime = new Date(oldestApiKey.expiry);

	return currentTime < expiryTime;
};
