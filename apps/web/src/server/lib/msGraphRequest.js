import { createHttpLoggerHooks } from '@pins/platform';
import config from '@pins/applications.web/environment/config.js';
import got from 'got';
import pino from './logger.js';

const [requestLogger, responseLogger, retryLogger] = createHttpLoggerHooks(
	pino,
	config.logLevelStdOut
);

const prefixUrl = 'https://graph.microsoft.com/v1.0/';

const instance = got.extend({
	prefixUrl,
	responseType: 'json',
	resolveBodyOnly: true,
	retry: {
		limit: 3,
		statusCodes: [500, 502, 503, 504]
	},
	hooks: {
		beforeRetry: [retryLogger],
		beforeRequest: [requestLogger],
		afterResponse: [responseLogger]
	}
});

/**
 * Type-safe implementation of a get request using the got instance.
 *
 * @template T
 * @param {string | URL} url
 * @param {import('got').OptionsOfJSONResponseBody=} options
 * @returns {import('got').CancelableRequest<T>}
 */
export function msGraphGet(url, options) {
	return /** @type {import('got').CancelableRequest<*>} */ (instance.get(url, options));
}
