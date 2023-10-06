/**
 * @param {string} string
 * @param {Array<string | number>} replacements
 * @returns {string}
 */
const stringTokenReplacement = (string, replacements) =>
	replacements
		.map((replacement) => String(replacement))
		.reduce(
			(replacedString, replacement, index) =>
				replacedString.replace(`{replacement${index}}`, replacement),
			string
		);

export default stringTokenReplacement;
