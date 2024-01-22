import got from 'got';
import { loadApiConfig } from './config.js';

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
	const requestUri = `https://${config.apiHost}/${path}`;

	logger.info(`Making POST request to ${requestUri}`);

	return got.post(requestUri, {
		json: body
	});
};
