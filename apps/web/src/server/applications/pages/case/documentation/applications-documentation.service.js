import { get } from '../../../../lib/request.js';

/**
 * @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory
 * @typedef {import('../../../applications.types').DocumentationFile} DocumentationFile
 */

/**
 * Get all the subfolders in a folder, or the top level folders for the case
 *
 * @param {number} id
 * @param {number | null} folderId
 * @returns {Promise<DocumentationCategory[]>}
 */
export const getCaseFolders = (id, folderId = null) => {
	return folderId
		? get(`applications/${id}/folders/${folderId}/sub-folders`)
		: get(`applications/${id}/folders`);
};

/**
 * Get a single folder on a case
 *
 * @param {number} caseId
 * @param {number} id
 * @returns {Promise<DocumentationCategory>}
 */
export const getCaseFolder = (caseId, id) => {
	const folder = get(`applications/${caseId}/folders/${id}`);

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
	const folderPath = get(`applications/${caseId}/folders/${folderId}/parent-folders`);

	return folderPath;
};

/**
 * Get the documents for the current folder
 *
 * @param {number} caseId
 * @param {DocumentationCategory |undefined} documentationCategory
 * @returns {DocumentationFile[]}
 */
export const getCaseDocumentationFilesInFolder = (caseId, documentationCategory) => {
	// TODO: Mock Version - to be replaced when API to get documents exists:
	/** @type {DocumentationFile[] } */
	let documentationFiles = [];

	if (caseId && documentationCategory) {
		documentationFiles = [{ fileName: 'sitting-1.png', url: '#' }];
	}
	return documentationFiles;
};
