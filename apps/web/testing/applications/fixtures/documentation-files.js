import { createDocumentationFile } from '../factory/documentation-file.js';

/**
 * @typedef {import('../../../src/server/applications/applications.types').DocumentationFile} DocumentationFile
 * @typedef {import('../../../src/server/applications/applications.types').PaginatedResponse<DocumentationFile>} PaginatedDocumentationFiles
 */

/** @type {DocumentationFile[]} */
export const fixtureDocumentationFiles = [...Array.from({ length: 123 }).keys()].map((index) =>
	createDocumentationFile({ documentGuid: `${index}` })
);

/**
 *
 * @param {number} page
 * @param {number} pageDefaultSize
 * @returns {PaginatedDocumentationFiles}
 */
export const fixturePaginatedDocumentationFiles = (page, pageDefaultSize) => ({
	page,
	pageSize: pageDefaultSize,
	pageDefaultSize,
	pageCount: Math.ceil(123 / pageDefaultSize),
	itemCount: 123,
	items: fixtureDocumentationFiles.slice(
		(page - 1) * pageDefaultSize,
		pageDefaultSize + (page - 1) * pageDefaultSize
	)
});
