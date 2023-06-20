import { createDocumentationFile } from '../factory/documentation-file.js';

/**
 * @typedef {import('../../../src/server/applications/applications.types').DocumentationFile} DocumentationFile
 * @typedef {import('../../../src/server/applications/applications.types').PaginatedResponse<DocumentationFile>} PaginatedDocumentationFiles
 */

/** @type {DocumentationFile[]} */
export const fixtureDocumentationFiles = [...Array.from({ length: 200 }).keys()].map((index) =>
	createDocumentationFile({ documentGuid: `${index}` })
);

/** @type {DocumentationFile} */
export const fixturePublishedDocumentationFile =
	fixtureDocumentationFiles.find((document) => document.publishedStatus === 'published') ||
	fixtureDocumentationFiles[0];

/** @type {DocumentationFile} */
export const fixtureReadyToPublishDocumentationFile =
	fixtureDocumentationFiles.find((document) => document.publishedStatus === 'ready_to_publish') ||
	fixtureDocumentationFiles[0];

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
	pageCount: Math.ceil(200 / pageDefaultSize),
	itemCount: 200,
	items: fixtureDocumentationFiles.slice(
		(page - 1) * pageDefaultSize,
		pageDefaultSize + (page - 1) * pageDefaultSize
	)
});

export const fixtureDocumentFileVersions = () => {
	return [
		{
			version: 1,
			dateCreated: '2021-01-01T00:00:00.000Z',
			redacted: false,
			fileName: 'test-file-1.pdf'
		}
	];
};
