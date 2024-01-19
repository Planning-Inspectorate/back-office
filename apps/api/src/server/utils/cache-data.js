import NodeCache from 'node-cache';

export const nodeCache = new NodeCache();

export const setCache = (
	/** @type {NodeCache.Key} */ key,
	/** @type {Record<string,any>[]} */ value,
	/** @type {number} */ ttl = 3600
) => {
	nodeCache.set(key, value, ttl);
};

export const getCache = (/** @type {NodeCache.Key} */ key) => {
	return nodeCache.get(key);
};
