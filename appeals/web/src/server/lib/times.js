import logger from './logger.js';

/**
 *
 * @param {number} timeHour
 * @param {number} timeMinute
 * @param {number} beforeTimeHour
 * @param {number} beforeTimeMinute
 * @returns {boolean} indicating whether time is before beforeTime
 */
export function timeIsBeforeTime(timeHour, timeMinute, beforeTimeHour, beforeTimeMinute) {
	return timeHour * 60 + timeMinute < beforeTimeHour * 60 + beforeTimeMinute;
}

/**
 * @param {string | null | undefined} time24
 * @returns {string | undefined}
 */
export function convert24hTo12hTimeStringFormat(time24) {
	if (time24 && is24HourTimeValid(time24)) {
		const [hours, minutes] = time24.split(':');
		const hoursInt = parseInt(hours, 10);
		const period = hoursInt >= 12 ? 'pm' : 'am';
		const hours12 = hoursInt % 12 || 12;
		const minutesInt = parseInt(minutes, 10);
		const formattedMinutes = minutesInt < 10 ? `0${minutesInt}` : `${minutesInt}`;
		const minutesIsZero = minutes === '00';
		return minutesIsZero ? `${hours12}${period}` : `${hours12}:${formattedMinutes}${period}`;
	}
	logger.warn(
		`Issue converting ${time24} from 24h to 12h: Time is either null, undefined, or invalid`
	);
	return undefined;
}

/**
 * @param {string} timeString
 */
export function is24HourTimeValid(timeString) {
	//Check the format hh:mm
	const timeRegex = /^(0?[0-9]|1[0-9]|2[0-3]?):(0?[0-9]|[1-5][0-9])$/;
	if (!timeRegex.test(timeString)) {
		return false;
	}

	// Validate the ranges
	const [hours, minutes] = timeString.split(':');
	const hoursInt = parseInt(hours, 10);
	const minutesInt = parseInt(minutes, 10);
	if (hoursInt < 0 || hoursInt > 23 || minutesInt < 0 || minutesInt > 59) {
		return false;
	}

	return true;
}
