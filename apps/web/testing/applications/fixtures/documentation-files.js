import { createDocumentationFile } from '../factory/documentation-file.js';

/**
 * @typedef {import('../../../src/server/applications/applications.types').DocumentationFile} DocumentationFile
 * @typedef {import('../../../src/server/applications/applications.types').PaginatedResponse<DocumentationFile>} PaginatedDocumentationFiles
 * @typedef {import('../../../src/server/applications/applications.types').DocumentVersion} DocumentVersion
 * /

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

/** @type {DocumentationFile} */
export const fixtureReadyToPublishDocumentationPdfFile =
	fixtureDocumentationFiles.find(
		(document) =>
			document.publishedStatus === 'ready_to_publish' && document.mime === 'application/pdf'
	) || fixtureDocumentationFiles[0];

/** @type {DocumentationFile} */
export const fixtureNotCheckedDocumentationFile =
	fixtureDocumentationFiles.find((document) => document.publishedStatus === 'not_checked') ||
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

/**
 *
 * @returns {DocumentVersion[]}
 */
export const fixtureDocumentFileVersions = [
	{
		documentGuid: '123',
		version: 1,
		history: {
			created: {
				name: 'Jane Doe',
				username: 'jane.doe@planninginspectorate.gov.uk',
				date: 1688389743
			},
			published: {
				name: 'John Doe',
				username: 'john.doe@planninginspectorate.gov.uk',
				date: 1688389740
			},
			unpublished: {
				name: 'John Doe',
				username: 'john.doe@planninginspectorate.gov.uk',
				date: 1688389743
			}
		},
		redacted: false,
		fileName: 'test-file-1.pdf',
		size: 3000,
		mime: 'application/pdf'
	},
	{
		documentGuid: '456',
		version: 2,
		history: {
			created: {
				name: 'Jane Doe',
				username: 'john.doe@planninginspectorate.gov.uk',
				date: 1688389743
			},
			published: null,
			unpublished: null
		},
		redacted: false,
		fileName: 'test-file-1.pdf',
		size: 5000,
		mime: 'video/mp4'
	}
];
