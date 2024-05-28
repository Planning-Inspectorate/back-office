import got from 'got';
import { loadApiConfig } from './config.js';
import { addAuthHeadersForBackend } from '@pins/add-auth-headers-for-backend';

const config = loadApiConfig();

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string} path
 * @param {unknown} body
 *
 * @returns {import('got').CancelableRequest<any>}
 */
export const makePostRequest = (logger, path, body) => {
	const scheme = config.apiHost.match(/localhost/) ? 'http' : 'https';
	const requestUri = `${scheme}://${config.apiHost}${path}`;

	logger.info(`Making POST request to ${requestUri}`);

	const serviceName = 'function';
	const requestWithApiKey = got.extend({
		hooks: {
			beforeRequest: [
				async (options) =>
					await addAuthHeadersForBackend(options, {
						azureKeyVaultEnabled: config.azureKeyVaultEnabled,
						apiKeyName: `backoffice-applications-api-key-${serviceName}`,
						callingClient: serviceName
					})
			]
		}
	});
	return requestWithApiKey.post(requestUri, {
		json: body
	});
};

/**
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string} path
 * @param {any} params
 *
 * @returns {Promise<any>}
 */
export const makeGetRequest = async (logger, path, params) => {
	const reqParams = new URLSearchParams();

	Object.keys(params).forEach((key) => {
		const value = params[key];
		if (Array.isArray(value)) {
			value.forEach((v) => reqParams.append(key, v));
		} else {
			reqParams.append(key, value);
		}
	});
	const scheme = config.apiHost.match(/localhost/) ? 'http' : 'https';
	const requestUri = `${scheme}://${config.apiHost}${path}?${reqParams.toString()}`;

	logger.info(`Making GET request to ${requestUri}`);

	const serviceName = 'function';

	const requestWithApiKey = got.extend({
		hooks: {
			beforeRequest: [
				async (options) => {
					await addAuthHeadersForBackend(options, {
						azureKeyVaultEnabled: config.azureKeyVaultEnabled,
						apiKeyName: `backoffice-applications-api-key-${serviceName}`,
						callingClient: serviceName
					});
				}
			]
		}
	});

	const response = await requestWithApiKey.get(requestUri, { responseType: 'json' });
	return response.body;
};
