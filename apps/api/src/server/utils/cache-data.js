import NodeCache from 'node-cache';

export const nodeCache = new NodeCache();

export const setCache = (
	/** @type {NodeCache.Key} */ key,
	/** @type {Record<string,any>[]} */ value
) => {
	nodeCache.set(key, value, 10_000);
};

export const getCache = (/** @type {NodeCache.Key} */ key) => {
	return nodeCache.get(key);
};
