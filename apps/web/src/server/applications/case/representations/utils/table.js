import { tableSortingHeaderLinks } from '../../../../../common/table/table-sorting-header-links.js';
import { representationsUrl } from '../config.js';

/**
 *
 * @param {object} query
 * @returns {{isDescending: boolean, link: string, active: boolean, text: string, value: string}[]}
 */
export const tableSortLinks = (query) => [
	tableSortingHeaderLinks(query, 'Reference', 'reference', representationsUrl),
	tableSortingHeaderLinks(query, 'From', '', representationsUrl),
	tableSortingHeaderLinks(query, 'Date received', 'received', representationsUrl),
	tableSortingHeaderLinks(query, 'Redacted', 'redacted', representationsUrl),
	tableSortingHeaderLinks(query, 'Status', 'status', representationsUrl),
	tableSortingHeaderLinks(query, 'Action', '', representationsUrl)
];
