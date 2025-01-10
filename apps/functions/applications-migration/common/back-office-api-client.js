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
	const request = constructAuthenticatedRequest();
	const requestUri = constructUri(path, params);

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

/**
 * Makes a POST request and processes streaming responses with `got`.
 */
export const makePostRequestStreamResponse = (logger, path, body) => {
	const requestUri = constructUri(path);
	const request = constructAuthenticatedRequest();

	logger.info(`Making POST request to ${requestUri}`);

	const stream = request.stream.post(requestUri, {
		json: body,
		headers: { 'Content-Type': 'application/json' }
	});

	stream.on('data', (chunk) => {
		logger.info(chunk.toString());
	});

	stream.on('end', () => {
		logger.info('Response fully received');
	});

	stream.on('error', (error) => {
		logger.error(`Error occurred during migration: ${JSON.stringify(error, null, 2)}`);
	});

	return stream;
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
 * @param {Record<string, string>} params
 * @returns {string}
 */
const constructUri = (path, params = {}) => {
	const reqParams = new URLSearchParams();
	const scheme = config.apiHost?.match(/localhost/) ? 'http' : 'https';
	Object.keys(params).forEach((key) => {
		const value = params[key];
		if (Array.isArray(value)) {
			value.forEach((v) => reqParams.append(key, v));
		} else {
			reqParams.append(key, value);
		}
	});
	let uri = `${scheme}://${config.apiHost}${path}`;
	if (reqParams.toString()) {
		uri += `?${reqParams.toString()}`;
	}
	return uri;
};
