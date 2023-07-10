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
