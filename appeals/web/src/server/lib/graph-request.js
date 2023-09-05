import { createHttpLoggerHooks } from '@pins/platform';
import config from '@pins/appeals.web/environment/config.js';
import got from 'got';
import pino from './logger.js';

const [requestLogger, responseLogger] = createHttpLoggerHooks(pino, config.logLevelStdOut);

export const prefixUrl = 'https://graph.microsoft.com/v1.0/';

const instance = got.extend({
	prefixUrl,
	responseType: 'json',
	resolveBodyOnly: true,
	hooks: {
		beforeRequest: [requestLogger],
		afterResponse: [responseLogger]
	}
});

/**
 * Type-safe implementation of a post request using the got instance.
 *
 * @template T
 * @param {string | URL} url
 * @param {import('got').OptionsOfJSONResponseBody=} options
 * @returns {import('got').CancelableRequest<T>}
 */
export function getData(url, options) {
	return /** @type {import('got').CancelableRequest<*>} */ (instance.get(url, options));
}
