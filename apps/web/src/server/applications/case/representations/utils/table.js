import { tableSortingHeaderLinks } from '../../../common/components/table/table-sorting-header-links.js';
import { representationsUrl } from '../config.js';

/**
 *
 * @param {object} query
 * @returns {import('../../../common/components/table/table-sorting-header-links.js').TableHeaderLink[]}
 */
export const tableSortLinks = (query) => [
	tableSortingHeaderLinks(query, 'Reference', 'reference', representationsUrl),
	tableSortingHeaderLinks(query, 'From', '', representationsUrl),
	tableSortingHeaderLinks(query, 'Date received', 'received', representationsUrl),
	tableSortingHeaderLinks(query, 'Redacted', 'redacted', representationsUrl),
	tableSortingHeaderLinks(query, 'Status', 'status', representationsUrl),
	tableSortingHeaderLinks(query, 'Action', '', representationsUrl)
];
