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
