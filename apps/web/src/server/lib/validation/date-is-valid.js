/**
 * Indicates whether the supplied date is valid and a real date (for example, this will return false for 29 February in non-leap years)
 *
 * @param {string} day
 * @param {string} month
 * @param {string} year
 * @returns {boolean}
 */
export default function (day, month, year) {
	if (day.length === 0 || day.length > 2 ||
		month.length === 0 || month.length > 2 ||
		year.length !== 4) {
		return false;
	}

	const dayNumber = Number.parseInt(day, 10);
	const monthNumber = Number.parseInt(month, 10);
	const yearNumber = Number.parseInt(year, 10);
	const date = new Date(`${yearNumber}-${monthNumber}-${dayNumber}`);

	return (
		date.getDate() === dayNumber &&
		date.getMonth() + 1 === monthNumber &&
		date.getFullYear() === yearNumber &&
		!Number.isNaN(date.getTime())
	);
}
