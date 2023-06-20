import { buildQueryString } from '../build-query-string.js';

/**
 *
 * @param {object} query
 * @param {string} text
 * @param {string} value
 * @param {string} url
 * @returns {{isDescending: boolean, link: string, active: boolean, text: string, value: string}}
 */
export const tableSortingHeaderLinks = (query, text, value, url) => {
	const localQuery = JSON.parse(JSON.stringify(query));

	const isActive = value === localQuery.sortBy;

	const isDescending = `-${value}` === localQuery.sortBy;

	localQuery.page = 1;

	localQuery.sortBy = localQuery.sortBy?.charAt(0) !== '-' && isActive ? `-${value}` : value;

	return {
		text,
		value,
		active: isActive,
		isDescending,
		link: `${url}?${buildQueryString(localQuery)}`
	};
};
