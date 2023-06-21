import { buildQueryString } from '../build-query-string.js';

/**
 *
 * @param {number} page
 * @param {number} pageSize
 * @param {number} pageCount
 * @param {number} itemCount
 * @returns {{of: number, from: number, to: (*|number)}}
 */
export const showingPage = (page, pageSize, pageCount, itemCount) => {
	const currentPage = page;

	return {
		from: pageSize * (currentPage - 1) + 1,
		to: currentPage === pageCount ? itemCount : pageSize * currentPage,
		of: itemCount
	};
};

/**
 *
 * @param {object} query
 * @param {string} query.pageSize
 * @param {string} query.page
 * @param {number} size
 * @param {string} url
 * @returns {{size: number, link: string, active: boolean}}
 */
const getDocumentsPerPage = (query, size, url) => {
	const localQuery = JSON.parse(JSON.stringify(query));
	const active = Number(query.pageSize) === size;

	localQuery.page = 1;
	localQuery.pageSize = size;
	return {
		size,
		link: `${url}?${buildQueryString(localQuery)}`,
		active
	};
};

/**
 *
 * @param {object} query
 * @param {string} query.pageSize
 * @param {string} query.page
 * @param {string} url
 * @param {Array<number>} perPage
 * @returns {{size: number, link: string, active: boolean}[]}
 */
export const getResultsPerPage = (query, url, perPage = [25, 50, 100]) =>
	perPage.map((element) => getDocumentsPerPage(query, element, url));
