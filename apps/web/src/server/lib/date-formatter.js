/**
 * converts an ISO date string to Europe/London time zone date string
 *
 * @param {string} dateISOString
 * @returns {string}
 */
export const dateFormatter = (dateISOString) =>
	dateISOString &&
	new Date(dateISOString).toLocaleDateString('en-GB', {
		timeZone: 'Europe/London',
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
