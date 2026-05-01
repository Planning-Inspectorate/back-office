export default /**
 * Capitalize uppercase string
 *
 * @param {string} uppercaseString
 * @returns {string}
 */
(uppercaseString) =>
	uppercaseString
		.split(' ')
		.reduce(
			(previousWords, word) => `${previousWords}${word.charAt(0)}${word.slice(1).toLowerCase()} `,
			''
		);
