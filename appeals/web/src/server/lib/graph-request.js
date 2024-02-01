import { createHttpLoggerHooks } from '@pins/platform';
import config from '@pins/appeals.web/environment/config.js';
import got from 'got';
import pino from './logger.js';

const [requestLogger, responseLogger, retryLogger] = createHttpLoggerHooks(
	pino,
	config.logLevelStdOut
);

export const prefixUrl = 'https://graph.microsoft.com/v1.0/';

const instance = got.extend({
	prefixUrl,
	retry: {
		limit: 3,
		statusCodes: [500, 502, 503, 504]
	},
	responseType: 'json',
	resolveBodyOnly: true,
	hooks: {
		beforeRetry: [retryLogger],
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
