import { isPast, endOfDay } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import enGB from 'date-fns/locale/en-GB/index.js';

export const timeZone = 'Europe/London';

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
 * @param {Date | number | string | null | undefined} date
 * @param {{ condensed?: boolean }} options
 * @returns {string}
 */
export function dateToDisplayDate(date, { condensed = false } = {}) {
	if (typeof date === 'undefined' || date === null || date === '0000-00-00') return '';

	//if date is a 10 digit number assume it's a timestamp and make it parsable by new Date()
	if (typeof date === 'number' && date.toString().length === 10) {
		date = date * 1000;
	}

	return formatInTimeZone(new Date(date), timeZone, condensed ? 'd MMM yyyy' : 'd MMMM yyyy', {
		locale: enGB
	});
}

/**
 * @param {Date} date
 * @returns {boolean}
 */
export const isDatePastToday = (date) => date && isPast(endOfDay(date));
