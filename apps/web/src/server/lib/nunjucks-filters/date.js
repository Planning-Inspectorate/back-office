import formatDate from 'date-fns/format/index.js';
import enGB from 'date-fns/locale/en-GB/index.js';
import { isDateInstance } from '../dates.js';

// TODO: remove this and always use the function below
/**
 * @param {Date | number | string} date
 * @param {{ condensed?: boolean }} options
 * @returns {string}
 */
export function displayDate(date, { condensed = false } = {}) {
	return formatDate(new Date(date), condensed ? 'd MMM yyyy' : 'd MMMM yyyy', { locale: enGB });
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

	return formatDate(date, format, { locale: enGB }) || '';
}
