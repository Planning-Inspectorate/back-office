/**
 *
 * @param {Date} date
 * @returns {number}
 */
export const mapDateToUnixTimestamp = (date) => (date ? Math.floor(date.getTime() / 1000) : date);
