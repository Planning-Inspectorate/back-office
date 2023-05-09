import querystring from 'node:querystring';

/**
 *
 * @param {any} query
 * @returns {string}
 */
export const buildQueryString = (query) => querystring.stringify(query);
