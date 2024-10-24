/** @typedef {{ add?: object, change?: object, remove?: string[] }} Alterations*/

/**
 * @param {object} object
 * @returns
 */
export const makeDeepCopy = (object) => JSON.parse(JSON.stringify(object));

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
