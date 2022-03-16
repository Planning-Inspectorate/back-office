/**
 * @param {Date} date date object to be formatted for getValidation controller
 * @returns {string} merged date parts in format DD MMM YYYY
 */
function formatDate(date) {
	const monthNames =['Jan', 'Feb', 'Mar', 'Apr',
		'May', 'Jun', 'Jul', 'Aug',
		'Sep', 'Oct', 'Nov', 'Dec'];

	const day = date.getDate();

	const monthIndex = date.getMonth();
	const monthName = monthNames[monthIndex];

	const year = date.getFullYear();

	return `${day} ${monthName} ${year}`;
}

export default formatDate;
