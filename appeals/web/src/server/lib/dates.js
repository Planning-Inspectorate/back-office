/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {boolean}
 */
export const dateIsValid = (year, month, day) => {
	const date = new Date(year, month - 1, day);
	const cleanMonth = `${month}`[0] === '0' ? `${month}`.slice(1) : `${month}`;
	const cleanDay = `${day}`[0] === '0' ? `${day}`.slice(1) : `${day}`;

	return (
		isDateInstance(date) &&
		`${date.getFullYear()}` === `${year}` &&
		`${date.getMonth() + 1}` === cleanMonth.trim() &&
		`${date.getDate()}` === cleanDay.trim()
	);
};

/**
 * @param {Date} date
 * @returns {boolean}
 */
export const isDateInstance = (date) => {
	return (
		date instanceof Date &&
		!Number.isNaN(date) &&
		!Number.isNaN(date.getDate()) &&
		!Number.isNaN(date.getMonth()) &&
		!Number.isNaN(date.getFullYear())
	);
};
