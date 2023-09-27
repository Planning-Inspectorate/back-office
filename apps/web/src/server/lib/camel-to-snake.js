/**
 * Convert a string in camel-case to a string in snake_case
 *
 * @param {string} input
 * @returns {string}
 * */
export const camelToSnake = (input) => input.toLowerCase().replace(/-/g, '_');
