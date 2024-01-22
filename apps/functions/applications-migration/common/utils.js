/**
 * @param {any} obj
 */
export const removeNullValues = (obj) => {
	Object.keys(obj).forEach((key) => {
		if (obj[key] === null) {
			delete obj[key];
		}
	});
};
