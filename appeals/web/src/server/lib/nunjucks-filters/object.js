/**
 * Determine if an object contains at least one of the provided keys.
 *
 * @param {object} object
 * @param {string[]} keys
 * @returns {boolean}
 */
export const hasOneOf = (object = {}, keys = []) => {
	return Object.keys(object).some((key) => keys.includes(key));
};
