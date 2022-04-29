import sub from 'date-fns/sub/index.js';

/**
 * Get yesterday's date.
 *
 * @returns {Date} - Yesterday's date
 */
export const yesterday = () => sub(new Date(), { days: 1 }); 
