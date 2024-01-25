import { fetchApiKey } from './fetch-api-key.js';
import { fetchFromCache, storeInCache } from './cache-handler.js';

/**
 * @typedef {Object} ApiKeyParameters
 * @property {boolean} azureKeyVaultEnabled
 * @property {string} apiKeyName
 * @property {string} callingClient
 */

/**
 * @param {import('got').Options} requestOptions
 * @param {ApiKeyParameters} apiKeyParameters
 */
export const addAuthHeadersForBackend = async (requestOptions, apiKeyParameters) => {
	if (!fetchFromCache(apiKeyParameters.apiKeyName)) {
		const apiKey = await fetchApiKey(
			apiKeyParameters.azureKeyVaultEnabled,
			apiKeyParameters.apiKeyName
		);

		// temporary to keep failures silent
		if (!apiKey) return;

		const lessThanHourTtl = 3540;
		storeInCache(apiKeyParameters.apiKeyName, apiKey, lessThanHourTtl);
	}
	const apiKey = fetchFromCache(apiKeyParameters.apiKeyName);

	requestOptions.headers['x-service-name'] = apiKeyParameters.callingClient;
	requestOptions.headers['x-api-key'] = apiKey.key;
};
