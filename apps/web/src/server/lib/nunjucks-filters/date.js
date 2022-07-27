import format from 'date-fns/format/index.js';
import enGB from 'date-fns/locale/en-GB/index.js';

/**
 * @param {Date | number | string} date
 * @param {{ condensed?: boolean }} options
 * @returns {string}
 */
export function displayDate(date, { condensed = false } = {}) {
	return format(new Date(date ), condensed ? 'd MMM yyyy' : 'd MMMM yyyy', { locale: enGB });
}

/**
 * @param {string|number} date
 * @returns {string}
 */
export function datestamp(date) {
	return format(new Date(Number.parseInt(date, 10) * 1000), 'dd/MM/yyyy', { locale: enGB });
	//return format(new Date(date ), 'dd/MM/yyyy', { locale: enGB });
}
