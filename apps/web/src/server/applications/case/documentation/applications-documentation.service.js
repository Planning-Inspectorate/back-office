import logger from '../../../lib/logger.js';
import { get, patch, post } from '../../../lib/request.js';

/**
 * @typedef {import('@pins/express').ValidationErrors} ValidationErrors
 * @typedef {import('../../applications.types').DocumentationCategory} DocumentationCategory
 * @typedef {import('../../applications.types').DocumentationFile} DocumentationFile
 * @typedef {import('../../applications.types').DocumentVersion} DocumentVersion
 * @typedef {import('../../applications.types').PaginatedResponse<DocumentationFile>} PaginatedDocumentationFiles
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
	return get(`applications/${caseId}/folders/${folderId}`);
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
	return post(`applications/${caseId}/folders/${folderId}/documents`, {
		json: {
			pageSize,
			pageNumber
		}
	});
};

/**
 * Update the status and the redaction of one or many documents
 *
 * @param {number} caseId
 * @param {{status: string, redacted?: boolean, items: Array<{guid: string}>}} payload
 * @returns {Promise<{items?: Array<{guid: string}>, errors?: {guid: string}[]}>}
 */
export const updateCaseDocumentationFiles = async (caseId, { status, redacted, items }) => {
	let response;

	try {
		response = await patch(`applications/${caseId}/documents/update`, {
			json: {
				status,
				redacted,
				items
			}
		});
	} catch (/** @type {*} */ error) {
		response = new Promise((resolve) => {
			resolve({ errors: error?.response?.body?.errors || [] });
		});
	}

	return response;
};

/**
 * Get the blob storage info for the file with the given GUID
 *
 * @param {number} caseId
 * @param {string} fileGuid
 * @returns {Promise<DocumentationFile>}
 */
export const getCaseDocumentationFileInfo = async (caseId, fileGuid) => {
	return get(`applications/${caseId}/documents/${fileGuid}/properties`);
};

/**
 * Get the blob storage info for the file with the given GUID
 *
 * @param {string} fileGuid
 * @returns {Promise<DocumentVersion[]>}
 */
export const getCaseDocumentationFileVersions = async (fileGuid) => {
	return get(`applications/document/${fileGuid}/versions`);
};

/**
 * Soft delete the documentation file
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @param {string} fileName
 * @returns {Promise<{isDeleted?: boolean, errors?: ValidationErrors}>}
 */
export const deleteCaseDocumentationFile = async (caseId, documentGuid, fileName) => {
	let response;

	try {
		response = await post(`applications/${caseId}/documents/${documentGuid}/delete`);
	} catch {
		response = new Promise((resolve) => {
			resolve({ errors: { msg: `${fileName} could not be deleted, please try again.` } });
		});
	}

	return response;
};

/**
 * Remove document from publishing queue
 *
 * @param {number} caseId
 * @param {string} documentGuid
 * @returns {Promise<{isDeleted?: boolean, errors?: ValidationErrors}>}
 */
export const removeCaseDocumentationPublishingQueue = async (caseId, documentGuid) => {
	let response;

	try {
		response = await post(
			`applications/${caseId}/documents/${documentGuid}/revert-published-status`
		);
	} catch {
		response = new Promise((resolve) => {
			resolve({
				errors: {
					msg: `The document could not be removed from the publishing queue, please try again.`
				}
			});
		});
	}

	return response;
};

/**
 * Get the documents for the current folder
 *
 * @param {number} caseId
 * @param {number} pageNumber
 * @returns {Promise<PaginatedDocumentationFiles>}
 */
export const getCaseDocumentationReadyToPublish = async (caseId, pageNumber) => {
	return post(`applications/${caseId}/documents/ready-to-publish`, {
		json: {
			pageSize: 125,
			pageNumber
		}
	});
};

/**
 * Publishes selected documents from the Ready to Publish queue
 *
 * @param {number} caseId
 * @param {{guid: string}[]} items
 * @returns {Promise<{items?: Array<{guid: string}>, errors?: {guid: string}[]}>}
 */
export const publishCaseDocumentationFiles = async (caseId, items) => {
	let response;

	try {
		response = await patch(`applications/${caseId}/documents/publish`, {
			json: {
				items
			}
		});
	} catch (/** @type {*} */ error) {
		// log out the actual publishing errors
		logger.error(error);
		response = new Promise((resolve) => {
			resolve({ errors: { msg: 'Your documents could not be published, please try again' } });
		});
	}

	return { items: response };
};
