import got from 'got';
import { loadApiConfig } from './config.js';

const config = loadApiConfig();

/**
 * Handle an HTTP trigger/request to run the migration
 *
 * @param {import('@azure/functions').Logger} log
 * @param {string} path
 * @param {unknown} body
 *
 * @returns {import('got').CancelableRequest<any>}
 */
export const makePostRequest = (log, path, body) => {
	const requestUri = `https://${config.apiHost}/${path}`;

	log(`Making POST request to ${requestUri}`);

	return got.post(requestUri, {
		json: body
	});
};
