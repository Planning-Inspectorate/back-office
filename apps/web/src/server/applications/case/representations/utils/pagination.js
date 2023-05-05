import { getPaginationLinks } from '../../../../../common/pagination/pagination-links.js';
import {
	getResultsPerPage,
	showingPage
} from '../../../../../common/pagination/pagination-results-per-page.js';
import { representationsUrl } from '../config.js';

/**
 *
 * @param {any} query
 * @param {object} representations
 * @param {number} representations.page
 * @param {number} representations.pageSize
 * @param {number} representations.pageCount
 * @param {number} representations.itemCount
 * @returns {{resultsPerPage: {size: number, link: string, active: boolean}[], paginationLinks: {next: ({href: string}|string), previous: ({href: string}|string), items: *[]}, showing: {of: number, from: number, to: (*|number)}}}
 */
export const getPagination = (query, { page, pageSize, pageCount, itemCount }) => ({
	showing: showingPage(page, pageSize, pageCount, itemCount),
	resultsPerPage: getResultsPerPage(query, representationsUrl),
	paginationLinks: getPaginationLinks(page, pageCount, query, representationsUrl)
});
