/**
 *
 * @param {string} dateString
 * @returns {number}
 */
export const mapDateStringToUnixTimestamp = (dateString) =>
	Math.floor(new Date(dateString).getTime() / 1000);
