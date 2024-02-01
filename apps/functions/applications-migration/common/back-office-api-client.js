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
	const requestUri = `https://${config.apiHost}${path}`;

	logger.info(`Making POST request to ${requestUri}`);

	const serviceName = 'function';
	const requestWithApiKey = got.extend({
		retry: {
			limit: 3,
			statusCodes: [500, 502, 503, 504]
		},
		hooks: {
			beforeRequest: [
				async (options) =>
					await addAuthHeadersForBackend(options, {
						azureKeyVaultEnabled: true,
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
