/**
 * @param {string} errorMessage
 * @param {Array<string | number>} replacements
 * @returns {string}
 */
const errorMessageReplacement = (errorMessage, replacements) =>
	replacements
		.map((replacement) => String(replacement))
		.reduce(
			(replacedErrorMessage, replacement, index) =>
				replacedErrorMessage.replace(`{replacement${index}}`, replacement),
			errorMessage
		);

export default errorMessageReplacement;
