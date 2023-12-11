/**
 * Converts the provided number into a label which will be read as a series of digits by screen readers, rather than the default decimal number reading (eg. "one two three" instead of "one hundred and twenty three")
 * @param {string|number} number
 * @returns {string}
 */
export const numberToAccessibleDigitLabel = (number) => {
	const input = `${number}`;

	if (/[^0-9]/.test(input)) {
		return input;
	}

	return input.split('').join(' ');
};
