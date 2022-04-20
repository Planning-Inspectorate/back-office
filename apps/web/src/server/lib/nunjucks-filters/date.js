import format from 'date-fns/format/index.js';
import { enGB } from 'date-fns/locale/index.js';

/**
 * @param {Date | number | string} date
 * @param {{ condensed?: boolean }} options
 * @returns {string}
 */
export function displayDate(date, { condensed = false } = {}) {
	return format(new Date(date), condensed ? 'd MMM yyyy' : 'd MMMM yyyy', { locale: enGB });
}
