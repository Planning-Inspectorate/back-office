/**
 *
 * @param {string} str
 * @returns {boolean}
 */
export const stringContainsDigitsOnly = (str) => {
	return !!str.trim().match(/^\d+$/);
};

/**
 *
 * @param {string} str
 * @returns {string}
 */
export const capitalizeFirstLetter = (str) => {
	if (str) {
		if (str.length > 1) {
			return str?.charAt(0)?.toUpperCase() + str?.slice(1);
		} else {
			return str?.toUpperCase();
		}
	} else {
		return '';
	}
};
