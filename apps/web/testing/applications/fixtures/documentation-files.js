import { createDocumentationFile } from '../factory/documentation-file.js';

/**
 * @typedef {import('../../../src/server/applications/applications.types').DocumentationFile} DocumentationFile
 * @typedef {import('../../../src/server/applications/applications.types').PaginatedResponse<DocumentationFile>} PaginatedDocumentationFiles
 */

/**
 *
 * @param {number} page
 * @param {number} pageDefaultSize
 * @returns {PaginatedDocumentationFiles}
 */
export const fixtureDocumentationFiles = (page, pageDefaultSize) => {
	const allItems = [...Array.from({ length: 123 }).keys()].map((index) =>
		createDocumentationFile({ guid: `${index}` })
	);

	return {
		page,
		pageSize: pageDefaultSize,
		pageDefaultSize,
		pageCount: Math.ceil(123 / pageDefaultSize),
		itemCount: 123,
		items: allItems.slice(
			(page - 1) * pageDefaultSize,
			pageDefaultSize + (page - 1) * pageDefaultSize
		)
	};
};
