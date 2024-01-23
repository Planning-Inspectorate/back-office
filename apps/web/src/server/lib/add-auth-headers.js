import { fetchFromCache, storeInCache } from './cache-handler.js';
import config from '@pins/applications.web/environment/config.js';
import { fetchApiKey } from './fetch-api-key.js';

/**
 * @param {import('got').Options=} options
 */
export const addAuthHeadersForBackend = async (options) => {
	if (!options) {
		console.log('API_KEY_TESTING: Request Options undefined');
		return;
		// throw Error('Request Options undefined');
	}

	const apiKeyName = `backoffice-applications-api-key-${config.serviceName}`;
	if (!fetchFromCache(apiKeyName)) {
		const apiKey = await fetchApiKey(apiKeyName);

		// temporary to keep failures silent
		if (!apiKey) return;

		const lessThanHourTtl = 3540;
		storeInCache(apiKeyName, apiKey, lessThanHourTtl);
	}
	const apiKey = fetchFromCache(apiKeyName);

	options.headers['x-service-name'] = config.serviceName;
	options.headers['x-api-key'] = apiKey.key;
};
