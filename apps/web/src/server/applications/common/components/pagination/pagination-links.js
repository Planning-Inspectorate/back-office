import { buildQueryString } from '../build-query-string.js';

/**
 *
 * @param {string} url
 * @param {object} query
 * @param {number} page
 * @param {boolean} current
 * @returns {{number: number, current: boolean, href: string}}
 */
function createPageLink(url, query, page, current) {
	return {
		href: `${url}?${buildQueryString({ ...query, page })}`,
		number: page,
		current
	};
}

/**
 *
 * @param {number} page
 * @param {number} pageCount
 * @param {{ [key: string]: any }} query
 * @param {string} url
 * @returns {{next: ({href: string}|string), previous: ({href: string}|string), items: *[]}}
 */
export const getPaginationLinks = (page, pageCount, query, url) => {
	const pageNumber = Number(page);
	const localQuery = { ...query };
	delete localQuery.page;
	const ellipsisThreshold = 6;
	const items = [];

	if (pageCount > ellipsisThreshold) {
		// Always show first page
		items.push(createPageLink(url, localQuery, 1, pageNumber === 1));

		// Ellipsis after first page
		if (pageNumber > 3) items.push({ ellipsis: true });

		// Pages around current
		for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
			if (i > 1 && i < pageCount) {
				items.push(createPageLink(url, localQuery, i, pageNumber === i));
			}
		}

		// Ellipsis before last page
		if (pageNumber < pageCount - 2) items.push({ ellipsis: true });

		// Always show last page
		items.push(createPageLink(url, localQuery, pageCount, pageNumber === pageCount));
	} else {
		for (let i = 1; i <= pageCount; i++) {
			items.push(createPageLink(url, localQuery, i, pageNumber === i));
		}
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
