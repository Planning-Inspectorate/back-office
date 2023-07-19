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

/**
 * @param {import("../appeals/appeal-details/appellant-case/appellant-case.service.js").DayMonthYear} dayMonthYear
 * @returns {string} - date in format YYYY-MM-DD
 */
export const dayMonthYearToApiDateString = (dayMonthYear) => {
	const dayString = dayMonthYear.day < 10 ? `0${dayMonthYear.day}` : dayMonthYear.day;
	const monthString = dayMonthYear.month < 10 ? `0${dayMonthYear.month}` : dayMonthYear.month;

	return `${dayMonthYear.year}-${monthString}-${dayString}`;
};
