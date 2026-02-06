import got from 'got';

export const aiRedactionClient = got.extend({
	resolveBodyOnly: true,
	responseType: 'json',
	retry: { limit: 0 }
});

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
export function aiRedactionClientPost(url, options) {
	return /** @type {import('got').CancelableRequest<*>} */ (aiRedactionClient.post(url, options));
}
