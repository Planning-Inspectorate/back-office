/**
 * @typedef {object} CacheItem
 * @property {?} data - The cached response.
 * @property {number} expires - The expiry time of this item.
 */

/**
 * Create a Got handler that caches the response of any request that provides a
 * `ttl` (time to live) value to the request context. Subsequent requests to
 * this url will serve the response from the cache rather than revisiting the
 * api, so long as the request takes place within the original request's expiry
 * window.
 *
 * Note that this handler is not related to http caching through headers, but as
 * a means to rate limit requests that otherwise would not have been cached.
 *
 * @param {Map<string, CacheItem>} ttlCache
 * @returns {import('got').HandlerFunction}
 */
export function createTtlHandler(ttlCache) {
	return (options, next) => {
		if (options.method === 'GET') {
			// (casting to a number is just to get jsdoc to recognise the type)
			const ttl = Number(options.context.ttl);

			if (!Number.isNaN(ttl) && options.url) {
				const now = Date.now();
				const href = typeof options.url === 'object' ? options.url.href : options.url;
				const cachedResponse = ttlCache.get(href);

				if (cachedResponse) {
					// If a previously cached response has not yet expired, we can serve
					// this without performing an http request
					if (cachedResponse.expires > now) {
						options.context.servedFromCache = true;

						return Promise.resolve(cachedResponse.data);
					}
					// As the previously cached response has expired, we can just delete it
					ttlCache.delete(href);
				}
				return /** @type {Promise<?>} */ (next(options)).then((data) => {
					// Cache the response and expiry time upon successful request
					ttlCache.set(href, { data, expires: now + ttl });
					return data;
				});
			}
		} else {
			ttlCache.clear();
		}
		return next(options);
	};
}
