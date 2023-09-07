/**
 *
 * @param {Date} date
 * @returns {number}
 */
export const mapDateToUnixTimestamp = (date) => Math.floor(date.getTime() / 1000);
