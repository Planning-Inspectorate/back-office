/**
 * Returns true if the provided object contains all of the provided keys, false otherwise
 *
 * @param {Object} object
 * @param {string|string[]} keys
 * @returns
 */
export const objectContainsAllKeys = (object, keys) => {
	const objectKeys = Object.keys(object);

	if (!Array.isArray(keys)) {
		return objectKeys.includes(keys);
	}

	return keys.every((key) => objectKeys.includes(key));
};

/**
 * TODO: write unit test for this utility
 * Returns true if the provided value is an object literal (i.e. an 'object' in the strict sense, not including other types which are considered objects in javascript, such as arrays)
 *
 * @param {any} value
 * @returns {boolean}
 */
export const isObjectLiteral = (value) => {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
};
