import got from 'got';
import { loadApiConfig } from './config.js';
import { addAuthHeadersForBackend } from '@pins/add-auth-headers-for-backend';

const config = loadApiConfig();

/**
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string} path
 *
 * @returns {Promise<any>}
 */
export const makeGetRequest = async (logger, path, params = {}) => {
	const reqParams = new URLSearchParams();

	Object.keys(params).forEach((key) => {
		const value = params[key];
		if (Array.isArray(value)) {
			value.forEach((v) => reqParams.append(key, v));
		} else {
			reqParams.append(key, value);
		}
	});
	const request = constructAuthenticatedRequest();
	const requestUri = constructUri(path);

	logger.info(`Making GET request to ${requestUri}`);
	const response = await request.get(requestUri, { responseType: 'json' });
	return response.body;
};

/**
 *
 * @param {import('@azure/functions').Logger} logger
 * @param {string} path
 * @param {unknown} body
 *
 * @returns {import('got').CancelableRequest<any>}
 */
export const makePostRequest = (logger, path, body) => {
	const request = constructAuthenticatedRequest();
	const requestUri = constructUri(path);

	logger.info(`Making POST request to ${requestUri}`);
	return request.post(requestUri, {
		json: body
	});
};

const constructAuthenticatedRequest = () => {
	const serviceName = 'function';
	const authenticatedRequest = got.extend({
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
	return authenticatedRequest;
};

/**
 *
 * @param {string} path
 * @returns {string}
 */
const constructUri = (path) => {
	const scheme = config.apiHost?.match(/localhost/) ? 'http' : 'https';
	return `${scheme}://${config.apiHost}${path}`;
};
