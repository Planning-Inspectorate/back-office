/**
 * @param {Date} date date object to be formatted for getValidation controller
 * @param {boolean} shortened
 * @returns {string} merged date parts in format DD MMM YYYY
 */
function formatDate(date, shortened = true) {
	const shortenedMonthNames = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];
	const fullMonthNames = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];

	const day = date.getDate().toString().padStart(2, '0');

	const monthIndex = date.getMonth();
	const monthNames = shortened ? shortenedMonthNames : fullMonthNames;
	const monthName = monthNames[monthIndex];

	const year = date.getFullYear();

	return `${day} ${monthName} ${year}`;
}

export default formatDate;
