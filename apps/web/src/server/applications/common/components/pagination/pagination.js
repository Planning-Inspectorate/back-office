import { getPaginationLinks } from './pagination-links.js';
import { getResultsPerPage, showingPage } from './pagination-results-per-page.js';

/**
 *
 * @param {any} query
 * @param {string} url
 * @param {object} params
 * @param {number} params.page
 * @param {number} params.pageSize
 * @param {number} params.pageCount
 * @param {number} params.itemCount
 * @returns {import('../../../../views/applications/components/pagination/pagination.js').Pagination.Info}
 */
export function getPaginationInfo(query, url, { page, pageSize, pageCount, itemCount }) {
	return {
		showing: showingPage(page, pageSize, pageCount, itemCount),
		resultsPerPage: getResultsPerPage(query, url),
		paginationLinks: getPaginationLinks(page, pageCount, query, url)
	};
}
