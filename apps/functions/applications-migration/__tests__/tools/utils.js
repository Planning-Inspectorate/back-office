/** @typedef {{ add?: object, change?: object, remove?: string[] }} Alterations*/

export const logger = {
	info: console.log,
	error: console.error,
	warn: console.warn,
	verbose: console.log
};

/**
 * @param {Record<string, unknown>} data
 * @param {Alterations} alterations
 */
export const configureAlterations = (data, alterations) => {
	data = { ...data, ...alterations.add, ...alterations.change };
	alterations.remove?.forEach((key) => delete data[key]);
};

export const createIncrementingId = (() => {
	let currentId = 1;
	return () => currentId++;
})();
