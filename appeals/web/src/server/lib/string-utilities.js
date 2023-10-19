/**
 *
 * @param {string} str
 * @returns {boolean}
 */
export const stringContainsDigitsOnly = (str) => {
	return !!str.match(/^\d+$/);
};
