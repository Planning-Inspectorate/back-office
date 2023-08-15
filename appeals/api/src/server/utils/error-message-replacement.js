/**
 * @param {string} errorMessage
 * @param {number} replacement
 * @returns {string}
 */
const errorMessageReplacement = (errorMessage, replacement) =>
	errorMessage.replace('{replacement}', String(replacement));

export default errorMessageReplacement;
