import { zonedTimeToUtc } from 'date-fns-tz';

/**
 * if default time comes as 00:00 and the type is a deadline,
 * we convert to 23:59 to match existing behaviour
 * @param {Date} date
 * @returns {Date}
 */
export const changeEndTime = (date) => {
	if (date.getHours() === 0 && date.getMinutes() === 0) {
		date.setHours(23, 59);
	}
	return date;
};

/**
 * Converts a date time in UTC which can be an end datetime (e.g. 23:59)
 * and can be returned as a single datetime or separated into date and time
 * @param {string | null | undefined} datetimeString
 * @param {{isEndDate: boolean}} options
 * @returns {Date | null}
 */
export const handleDateTimeToUTC = (datetimeString, { isEndDate = false }) => {
	if (!datetimeString || isNaN(new Date(datetimeString).getTime())) {
		return null;
	}

	const datetime = new Date(datetimeString);
	const datetimeWithTime = isEndDate ? changeEndTime(datetime) : datetime;
	return zonedTimeToUtc(datetimeWithTime, 'Europe/London');
};
