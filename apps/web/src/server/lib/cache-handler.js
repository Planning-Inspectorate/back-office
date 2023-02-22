import NodeCache from 'node-cache';
import logger from './logger.js';

/**
 * @description A constant that holds an instance of the `NodeCache` class.
 * This cache can be used to store and retrieve data in-memory.
 */
export const nodeCache = new NodeCache();

/**
 * @constant {Function} storeInCacheTTL
 * @param {number} [ttl] - The Time To Live (TTL) value in seconds.
 * @returns {number} The cache TTL value.
 * @description A constant holding a function that returns the cache Time To Live (TTL) value in seconds.
 * The function takes an optional `ttl` parameter, which if truthy, is returned as the cache TTL.
 * If `ttl` is falsy, the default value of 3600 (1 hour) is returned as the cache TTL.
 */
export const storeInCacheTTL = (ttl) => ttl || 3600;

/**
 * @function storeInCache
 * @param {string} key - The key to set in the cache.
 * @param {any} value - The value to set in the cache.
 * @param {number} [ttl] - The Time To Live (TTL) value in seconds.
 * @description A function that sets a value in the cache with a specified key and TTL.
 * The function takes in three parameters: a `key` (string) to set in the cache, a `value` (of any type) to set in the cache, and an optional `ttl` (number) in seconds.
 * The `ttl` parameter is passed to the `storeInCacheTTL` function, which returns the cache TTL value.
 * The `nodeCache.set` method is then used to set the `value` in the cache with the specified `key` and `cacheTTL`.
 */
export async function storeInCache(key, value, ttl) {
	const cacheTTL = storeInCacheTTL(ttl);

	nodeCache.set(key, value, cacheTTL);

	logger.info('set generated access token into cache');
}

/**
 * @function fetchFromCache
 * @description Retrieve a value from the cache with a specified key.
 * @async
 * @param {string} key - The key of the value to be retrieved from the cache.
 * @returns {Promise<any>} - The value stored in the cache with the specified key.
 */
export async function fetchFromCache(key) {
	const cache = await nodeCache.get(key);

	if (cache) {
		logger.info(`Successfully fetched value with key "${key}" from the cache`);
	} else {
		logger.info(`Unable to fetch value with key "${key}" from the cache`);
	}

	return cache;
}
