import { mapDateToUnixTimestamp } from './map-date-to-unix-timestamp.js';

/**
 *
 * @param {string} dateString
 * @returns {number}
 */
export const mapDateStringToUnixTimestamp = (dateString) =>
	mapDateToUnixTimestamp(new Date(dateString));
