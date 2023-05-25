import { getPaginationLinks } from '../../../common/components/pagination/pagination-links.js';
import {
	getResultsPerPage,
	showingPage
} from '../../../common/components/pagination/pagination-results-per-page.js';
import { representationsUrl } from '../config.js';

/**
 *
 * @param {any} query
 * @param {object} representations
 * @param {number} representations.page
 * @param {number} representations.pageSize
 * @param {number} representations.pageCount
 * @param {number} representations.itemCount
 * @returns {import('../../../../views/applications/components/pagination/pagination.js').Pagination.Info}
 */
export const getPagination = (query, { page, pageSize, pageCount, itemCount }) => ({
	showing: showingPage(page, pageSize, pageCount, itemCount),
	resultsPerPage: getResultsPerPage(query, representationsUrl),
	paginationLinks: getPaginationLinks(page, pageCount, query, representationsUrl)
});
