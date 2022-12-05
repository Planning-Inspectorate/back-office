import { get } from '../../../../lib/request.js';

/**
 * @typedef {import('../../../applications.types').DocumentationCategory} DocumentationCategory
 * @typedef {import('../../../applications.types').DocumentationFile} DocumentationFile
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
	const folderPath = get(`applications/${caseId}/folders/${folderId}/parent-folders`);

	return folderPath;
};

/**
 * Get the documents for the current folder
 *
 * @param {number} caseId
 * @param {number} folderId
 * @returns {Promise<DocumentationFile[]>}
 */
export const getCaseDocumentationFilesInFolder = async (caseId, folderId) => {
	return get(`applications/${caseId}/folders/${folderId}/documents`);
};
