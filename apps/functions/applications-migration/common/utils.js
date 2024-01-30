/**
 * @param {any} obj
 *
 * @returns {any} obj
 */
export const removeNullValues = (obj) => removeValues(obj, [null]);

/**
 * @param {object} obj
 * @param {any[]} values
 */
export const removeValues = (obj, values) => {
	Object.keys(obj).forEach((key) => {
		if (values.includes(obj[key])) {
			delete obj[key];
		}
	});

	return obj;
};
