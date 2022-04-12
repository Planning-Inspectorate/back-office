import subDays from 'date-fns/subDays/index.js';

/**
 * Get yesterday's date.
 *
 * @returns {Date} - Yesterday's date
 */
export const yesterday = () => subDays(new Date(), 1);
