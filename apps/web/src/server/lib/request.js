// eslint-disable-next-line import/no-unresolved
import got from 'got';
import kleur from 'kleur';
import { createTtlHandler } from '@pins/platform';
import { config } from '../config/config.js';

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
		createTtlHandler(),
		(options, next) => {
			if (!options.context.servedFromCache) {
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
 * @param {string | URL} url - The url.
 * @param {import('got').OptionsOfJSONResponseBody=} options - All options
 * accepted by got.
 * @returns {import('got').CancelableRequest<T>} - A cancelable promise that
 * resolves to the generic type.
 */
export const get = (url, options) => instance.get(url, options);

/**
 * Type-safe implementation of a post request using the got instance.
 *
 * As jsdoc cannot determine the correct typescript overload to use because we
 * cannot pass a generic at the point of function call, the correct overload is
 * not derived, and jsdoc assumes all responses are the default return type of
 * string.
 *
 * @template T
 * @param {string | URL} url - The url.
 * @param {import('got').OptionsOfJSONResponseBody=} options - All options
 * accepted by got.
 * @returns {import('got').CancelableRequest<T>} - A cancelable promise that
 * resolves to the generic type.
 */
export const post = (url, options) => instance.post(url, options);

/**
 * Type-safe implementation of a patch request using the got instance.
 *
 * As jsdoc cannot determine the correct typescript overload to use because we
 * cannot pass a generic at the point of function call, the correct overload is
 * not derived, and jsdoc assumes all responses are the default return type of
 * string.
 *
 * @template T
 * @param {string | URL} url - The url.
 * @param {import('got').OptionsOfJSONResponseBody=} options - All options
 * accepted by got.
 * @returns {import('got').CancelableRequest<T>} - A cancelable promise that
 * resolves to the generic type.
 */
export const patch = (url, options) => instance.patch(url, options);

export default instance;
