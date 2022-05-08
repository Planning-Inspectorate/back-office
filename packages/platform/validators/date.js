/**
 * Determine whether a provided date is in the past. Note that today's date
 * counts as valid.
 *
 * @param {Date | string | number} value - The date to be validated.
 * @returns {boolean} - The date is today or in the past.
 */
export function validatePastDate(value) {
	return timeDiff(value, Date.now()) >= 0;
}

/**
 * Determine whether a provided date is in the future. Note that today's date
 * counts as valid.
 *
 * @param {Date | string | number} value - The date to be validated.
 * @returns {boolean} - The date is today or in the future.
 */
export const validateFutureDate = (value) => {
	return timeDiff(value, Date.now()) <= 0;
};

/**
 * Convert a date, number or string to a value in milliseconds.
 *
 * @param {Date | string | number} value - The date to be transformed.
 * @returns {number} - The date in milliseconds.
 */
function toTimestamp(value) {
	let date = value;

	if (typeof date === 'string') {
		const [year, month, day] = date.split('-');

		date = new Date(+year, +month - 1, +day);
	} else {
		date = new Date(value);
	}
	date.setHours(0, 0, 0, 0);

	return date.getTime();
}

/**
 * @param {Date | string | number} a - The date to be compared to.
 * @param {Date | string | number} b - The date to be compared from.
 * @returns {number} - The time difference in milliseconds.
 */
function timeDiff(a, b) {
	return toTimestamp(b) - toTimestamp(a);
}
