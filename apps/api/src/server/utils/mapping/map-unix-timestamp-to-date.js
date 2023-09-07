/**
 *
 * @param {number} value
 * @returns {Date}
 */
export const mapUnixTimestampToDate = (value) => {
	return new Date(value * 1000);
};
