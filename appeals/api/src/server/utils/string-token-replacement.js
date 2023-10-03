/**
 * @param {string} errorMessage
 * @param {Array<string | number>} replacements
 * @returns {string}
 */
const stringTokenReplacement = (errorMessage, replacements) =>
	replacements
		.map((replacement) => String(replacement))
		.reduce(
			(replacedErrorMessage, replacement, index) =>
				replacedErrorMessage.replace(`{replacement${index}}`, replacement),
			errorMessage
		);

export default stringTokenReplacement;
