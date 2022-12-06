import { fixtureDocumentationFiles } from '../../../../../../testing/applications/fixtures/documentation-files.js';
import { get } from '../../../../lib/request.js';

/**
 * @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory
 * @typedef {import('../../../applications.types').DocumentationFile} DocumentationFile
 * @typedef {import('../../../applications.types').PaginatedResponse<DocumentationFile>} PaginatedDocumentationFiles
 */

/**
 * Get all the subfolders in a folder, or the top level folders for the case
 *
 * @param {number} caseId
 * @param {number | null} folderId
 * @returns {Promise<DocumentationCategory[]>}
 */
export const getCaseFolders = (caseId, folderId = null) => {
	return folderId
		? get(`applications/${caseId}/folders/${folderId}/sub-folders`)
		: get(`applications/${caseId}/folders`);
};

/**
 * Get a single folder on a case
 *
 * @param {number} caseId
 * @param {number} folderId
 * @returns {Promise<DocumentationCategory>}
 */
export const getCaseFolder = (caseId, folderId) => {
	const folder = get(`applications/${caseId}/folders/${folderId}`);

	return folder;
};

/**
 * Get the path of all parent folder(s) for the current folder - used for breadcrumbs etc.
 * returned as an ordered list
 *
 * @param {number} caseId
 * @param {number} folderId
 * @returns {Promise<DocumentationCategory[]>}
 */
export const getCaseDocumentationFolderPath = (caseId, folderId) => {
	return get(`applications/${caseId}/folders/${folderId}/parent-folders`);
};

/**
 * Get the documents for the current folder
 *
 * @param {number} caseId
 * @param {number} folderId
 * @param {number} pageSize
 * @param {number} pageNumber
 * @returns {Promise<PaginatedDocumentationFiles>}
 */
export const getCaseDocumentationFilesInFolder = async (caseId, folderId, pageSize, pageNumber) => {
	const documentationFiles = fixtureDocumentationFiles;

	const items = documentationFiles.slice(pageNumber * pageSize, pageSize + pageNumber * pageSize);
	const response = {
		items,
		itemCount: documentationFiles.length,
		pageCount: Math.ceil(documentationFiles.length / pageSize),
		page: pageNumber,
		pageSize
	};

	return new Promise((resolve) => {
		setTimeout(() => resolve(response), 200);
	});

	// TODO: remove the mock above and run the actual get
	// return get(`applications/${caseId}/folders/${folderId}/documents`);
};
