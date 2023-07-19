import { DEFAULT_TIMESTAMP_TIME } from '../endpoints/constants.js';

/**
 * @param {string} value
 * @returns {string}
 */
const joinDateAndTime = (value) => `${value}T${DEFAULT_TIMESTAMP_TIME}Z`;

export default joinDateAndTime;
