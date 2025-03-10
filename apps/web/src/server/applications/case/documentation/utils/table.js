import { tableSortingHeaderLinks } from '../../../common/components/table/table-sorting-header-links.js';

/**
 *
 * @param {object} query
 * @returns {import('../../../common/components/table/table-sorting-header-links.js').TableHeaderLink[]}
 */
export const tableSortLinks = (query) => [
	tableSortingHeaderLinks(query, 'Document information', 'fileName', ''),
	tableSortingHeaderLinks(query, 'Date received', 'dateCreated', ''),
	tableSortingHeaderLinks(query, 'Redaction', 'redactedStatus', ''),
	tableSortingHeaderLinks(query, 'Status', 'publishedStatus', ''),
	tableSortingHeaderLinks(query, 'Actions', '', '')
];
