import { formatInTimeZone } from 'date-fns-tz';
import enGB from 'date-fns/locale/en-GB/index.js';
import logger from '#lib/logger.js';

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
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {boolean}
 */
export const dateIsInTheFuture = (year, month, day) => {
	const date = new Date(year, month - 1, day);
	const now = new Date();

	return dateIsValid(year, month, day) && now < date;
};

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {boolean}
 */
export const dateIsTodayOrInThePast = (year, month, day) => {
	const date = new Date(year, month - 1, day);
	const now = new Date();

	return dateIsValid(year, month, day) && date <= now;
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
 * @param {import('../appeals/appeals.types.js').DayMonthYear} dayMonthYear
 * @returns {string} - date in format YYYY-MM-DD
 */
export const dayMonthYearToApiDateString = (dayMonthYear) => {
	const dayString = dayMonthYear.day < 10 ? `0${dayMonthYear.day}` : dayMonthYear.day;
	const monthString = dayMonthYear.month < 10 ? `0${dayMonthYear.month}` : dayMonthYear.month;

	return `${dayMonthYear.year}-${monthString}-${dayString}`;
};

/**
 * @param {string|null|undefined} apiDateString - date in format YYYY-MM-DD
 * @returns {import('../appeals/appeals.types.js').DayMonthYear|undefined}
 */
export const apiDateStringToDayMonthYear = (apiDateString) => {
	if (apiDateString === null || apiDateString === undefined) {
		return;
	}

	const date = new Date(apiDateString);

	if (date.toString() === 'Invalid Date') {
		logger.error('The date string provided parsed to an invalid date');
		return;
	}

	const dayMonthYear = {
		day: date.getDate(),
		month: date.getMonth(),
		year: date.getFullYear()
	};

	if (isNaN(dayMonthYear.day) || isNaN(dayMonthYear.month) || isNaN(dayMonthYear.year)) {
		return;
	}

	// date.getMonth() returns a zero-based month value, but DayMonthYear.month should be a 1-based value (see notes on DayMonthYear type definition)
	dayMonthYear.month += 1;

	return dayMonthYear;
};

/**
 * @param {string | undefined} hour
 * @param {string | undefined} minute
 * @returns {string} - time in format HH:MM
 */
export const hourMinuteToApiDateString = (hour, minute = '0') => {
	if (!hour) {
		return '';
	}

	const hourString = hour.padStart(2, '0');
	const minuteString = minute.padStart(2, '0');

	return `${hourString}:${minuteString}`;
};

/**
 * @param {Date | number | string | null | undefined} date
 * @param {{ condensed?: boolean }} options
 * @returns {string}
 */
export function dateToDisplayDate(date, { condensed = false } = {}) {
	if (typeof date === 'undefined' || date === null) {
		return '';
	}

	return formatInTimeZone(new Date(date), timeZone, condensed ? 'd MMM yyyy' : 'd MMMM yyyy', {
		locale: enGB
	});
}

/**
 * @param {Date | null | undefined} date
 * @returns {string}
 */
export function dateToDisplayTime(date) {
	if (typeof date === 'undefined' || date === null) {
		return '';
	}

	const hours = date.getHours();
	const minutes = date.getMinutes();

	return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}

/**
 * @param {import('../appeals/appeals.types.js').DayMonthYear} dayMonthYear
 * @returns {string}
 */
export function webDateToDisplayDate(dayMonthYear, { condensed = false } = {}) {
	if (typeof dayMonthYear === 'undefined' || dayMonthYear === null) {
		return '';
	}

	const { day, month, year } = dayMonthYear;

	if (day && month && year) {
		const date = new Date();
		date.setDate(day);
		// date.setMonth() requires a zero-based month value, but DayMonthYear.month is a 1-based value (see notes on DayMonthYear type definition)
		date.setMonth(month - 1);
		date.setFullYear(year);

		return formatInTimeZone(date, timeZone, condensed ? 'd MMM yyyy' : 'd MMMM yyyy', {
			locale: enGB
		});
	} else {
		return '';
	}
}
