import { createHttpLoggerHooks, createHttpRetryParams } from '@pins/platform';
import config from '@pins/applications.web/environment/config.js';
import got from 'got';
import pino from './logger.js';
import { addAuthHeadersForBackend } from '@pins/add-auth-headers-for-backend';

const [requestLogger, responseLogger, retryLogger] = createHttpLoggerHooks(
	pino,
	config.logLevelStdOut
);
const retryParams = createHttpRetryParams(config.retry);

const instance = got.extend({
	prefixUrl: config.apiUrl,
	responseType: 'json',
	resolveBodyOnly: true,
	retry: retryParams,
	hooks: {
		beforeRetry: [retryLogger],
		beforeRequest: [
			requestLogger,
			async (options) =>
				await addAuthHeadersForBackend(options, {
					azureKeyVaultEnabled: config.azureKeyVaultEnabled,
					apiKeyName: `backoffice-applications-api-key-${config.serviceName}`,
					callingClient: config.serviceName
				})
		],
		afterResponse: [responseLogger]
	}
});

/**
 * As jsdoc cannot determine the correct typescript overload to use because we
 * cannot pass a generic at the point of function call, the correct overload is
 * not derived, and jsdoc assumes all responses are the default return type of
 * string.
 */

/**
 * Type-safe implementation of a HEAD request using the got instance.
 *
 * @template T
 * @param {string | URL} url
 * @param {import('got').OptionsOfJSONResponseBody=} options
 * @returns {import('got').CancelableRequest<T>}
 */
export function head(url, options) {
	return /** @type {import('got').CancelableRequest<*>} */ (instance.head(url, options));
}

/**
 * Type-safe implementation of a post request using the got instance.
 *
 * @template T
 * @param {string | URL} url
 * @param {import('got').OptionsOfJSONResponseBody=} options
 * @returns {import('got').CancelableRequest<T>}
 */
export function get(url, options) {
	return /** @type {import('got').CancelableRequest<*>} */ (instance.get(url, options));
}

/**
 * Type-safe implementation of a post request using the got instance.
 *
 * As jsdoc cannot determine the correct typescript overload to use because we
 * cannot pass a generic at the point of function call, the correct overload is
 * not derived, and jsdoc assumes all responses are the default return type of
 * string.
 *
 * @template T
 * @param {string | URL} url
 * @param {import('got').OptionsOfJSONResponseBody=} options
 * @returns {import('got').CancelableRequest<T>}
 */
export function post(url, options) {
	return /** @type {import('got').CancelableRequest<*>} */ (instance.post(url, options));
}

/**
 * Type-safe implementation of a patch request using the got instance.
 *
 * As jsdoc cannot determine the correct typescript overload to use because we
 * cannot pass a generic at the point of function call, the correct overload is
 * not derived, and jsdoc assumes all responses are the default return type of
 * string.
 *
 * @template T
 * @param {string | URL} url
 * @param {import('got').OptionsOfJSONResponseBody=} options
 * @returns {import('got').CancelableRequest<T>}
 */
export function patch(url, options) {
	return /** @type {import('got').CancelableRequest<*>} */ (instance.patch(url, options));
}

/**
 *
 * @template T
 * @param {string | URL} url
 * @param {import('got').OptionsOfJSONResponseBody=} options
 * @returns {import('got').CancelableRequest<T>}
 */
export function deleteRequest(url, options) {
	return /** @type {import('got').CancelableRequest<*>} */ (instance.delete(url, options));
}

/**
 * Type-safe implementation of a stream request using the got instance.
 *
 * @template T
 * @param {string | URL} url
 * @returns {*}
 */
export function stream(url) {
	return instance.stream(url);
}

export default instance;
