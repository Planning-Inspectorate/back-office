import { fetchFromCache, storeInCache } from './cache-handler.js';
import config from '@pins/applications.web/environment/config.js';
import { fetchApiKey } from './fetch-api-key.js';

/**
 * @param {import('got').Options=} options
 */
export const addAuthHeadersForBackend = async (options) => {
	if (!options) throw Error('Request Options undefined');

	const apiKeyName = `${config.serviceName}-api-key`;
	if (!fetchFromCache(apiKeyName)) {
		const apiKey = await fetchApiKey(apiKeyName);
		const lessThanHourTtl = 3540;
		storeInCache(apiKeyName, apiKey, lessThanHourTtl);
	}
	const apiKey = fetchFromCache(apiKeyName);

	options.headers['x-service-name'] = config.serviceName;
	options.headers['x-api-key'] = apiKey.key;
};
