/**
 *
 * @param {Date} date
 * @param {Date} afterDate
 * @returns {boolean}
 */
export const dateIsAfterDate = (date, afterDate) => {
	return date.getTime() > afterDate.getTime();
};
