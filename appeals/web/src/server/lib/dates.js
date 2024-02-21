import { formatInTimeZone } from 'date-fns-tz';
import enGB from 'date-fns/locale/en-GB/index.js';
import logger from '#lib/logger.js';
import { isValid, isBefore, isAfter, startOfDay, parseISO, format } from 'date-fns';

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
		isValid(date) &&
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
	return isAfter(date, startOfDay(new Date()));
};

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {boolean}
 */
export const dateIsInThePast = (year, month, day) => {
	const date = new Date(year, month - 1, day);
	return isBefore(date, startOfDay(new Date()));
};

/**
 * @param {number} year
 * @param {number} month
 * @param {number} day
 * @returns {boolean}
 */
export const dateIsTodayOrInThePast = (year, month, day) => {
	const date = new Date(year, month - 1, day);
	return !isAfter(date, startOfDay(new Date()));
};

/**
 * Converts the supplied date to a UTC date without any time component (useful for comparisons which should not factor in time)
 * More information here: https://stackoverflow.com/a/38050824
 * @param {Date} date
 * @returns {Date}
 */
export const dateToUTCDateWithoutTime = (date) => {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
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
	const date = parseISO(apiDateString);

	if (!isValid(date)) {
		logger.error('The date string provided parsed to an invalid date');
		return;
	}
	return {
		day: date.getDate(),
		month: date.getMonth() + 1,
		year: date.getFullYear()
	};
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

	return formatInTimeZone(date, timeZone, condensed ? 'd MMM yyyy' : 'd MMMM yyyy', {
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

	return format(date, 'HH:mm');
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
	const date = new Date(Date.UTC(year, month - 1, day));
	const formatString = condensed ? 'd MMM yyyy' : 'd MMMM yyyy';
	return formatInTimeZone(date, timeZone, formatString, { locale: enGB });
}
