import { createTtlHandler } from '@pins/platform';
import config from '@pins/web/environment/config.js';
import got from 'got';
import kleur from 'kleur';

export const ttlCache = new Map();

const instance = got.extend({
	prefixUrl: config.API_HOST,
	responseType: 'json',
	resolveBodyOnly: true,
	hooks: {
		// temporary pending implementation of authentication
		beforeRequest: [
			(options) => {
				options.headers.userid = '1';
			}
		]
	},
	handlers: [
		createTtlHandler(ttlCache),
		(options, next) => {
			if (!options.context.servedFromCache && typeof options.url === 'string') {
				console.log(`Sending ${kleur.bgBlue(options.method)} to ${kleur.blue(options.url)}`);
			}
			return next(options);
		}
	]
});

/**
 * As jsdoc cannot determine the correct typescript overload to use because we
 * cannot pass a generic at the point of function call, the correct overload is
 * not derived, and jsdoc assumes all responses are the default return type of
 * string.
 */

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

export default instance;
