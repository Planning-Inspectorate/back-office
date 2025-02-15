import enGB from 'date-fns/locale/en-GB/index.js';
import { formatInTimeZone } from 'date-fns-tz';
import { isDateInstance } from '../dates.js';

const timeZone = 'Europe/London';

/**
 * @param {Date | number | string | null | undefined} date
 * @param {{ condensed?: boolean }} options
 * @returns {string}
 */
export function displayDate(date, { condensed = false } = {}) {
	if (!date) {
		return '';
	}

	return formatInTimeZone(new Date(date), timeZone, condensed ? 'd MMM yyyy' : 'd MMMM yyyy', {
		locale: enGB
	});
}

/**
 * @param {string|number} unixDate
 * @param {{format: string}=} options
 * @returns {string}
 */
export function datestamp(unixDate, options) {
	const { format = 'dd/MM/yyyy' } = options || {};
	const unixDateNumber = Number.parseInt(`${unixDate}`, 10);
	const date = new Date(unixDateNumber * 1000);

	if (unixDateNumber === 0 || Number.isNaN(unixDateNumber) || !isDateInstance(date)) {
		return '';
	}

	return formatInTimeZone(date, timeZone, format, { locale: enGB }) || '';
}

/**
 * @param {string=} year
 * @param {string=} month
 * @param {string=} day
 * @returns {string|null}
 */
export function dateString(year, month, day) {
	const numberDay = Number.parseInt(day || '', 10);
	const date = new Date(`${year}-${month}-${numberDay}`);

	if (!isDateInstance(date)) {
		return null;
	}

	return formatInTimeZone(date, timeZone, 'dd MMM yyyy', { locale: enGB }) || '';
}
