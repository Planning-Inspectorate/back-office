import format from 'date-fns/format/index.js';
import { enGB } from 'date-fns/locale/index.js';

/**
 * Format today's date according to en-GB locale.
 *
 * @param {string=} dateFormat - The date format (defaults to d MMMM yyyy). See
 * https://date-fns.org/v2.28.0/docs/format
 * @returns {string} - Today's formatted date (for en-GB)
 */
export const today = (dateFormat = 'd MMMM yyyy') => format(new Date(), dateFormat, { locale: enGB });
