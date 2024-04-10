/**
 * Convert label to Enter label
 *
 * @param {string} value
 * @returns {string}
 */
export const enterLabel = (value) => 'Enter ' + value.charAt(0).toLowerCase() + value.slice(1);
