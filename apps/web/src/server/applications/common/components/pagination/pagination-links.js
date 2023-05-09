import { buildQueryString } from '../build-query-string.js';

/**
 *
 * @param {number} page
 * @param {number} pageCount
 * @param {object} query
 * @param {string} url
 * @returns {{next: ({href: string}|string), previous: ({href: string}|string), items: *[]}}
 */
export const getPaginationLinks = (page, pageCount, query, url) => {
	const pageNumber = Number(page);
	const localQuery = JSON.parse(JSON.stringify(query));

	delete localQuery.page;

	const items = [];

	for (let index = 1; index <= pageCount; index += 1) {
		items.push({
			href: `${url}?${buildQueryString({ ...query, page: index })}`,
			number: index,
			current: pageNumber === index
		});
	}

	return {
		previous:
			pageNumber > 1
				? { href: `${url}?${buildQueryString({ ...query, page: pageNumber - 1 })}` }
				: '',
		next:
			pageNumber < pageCount
				? { href: `${url}?${buildQueryString({ ...query, page: pageNumber + 1 })}` }
				: '',
		items
	};
};
