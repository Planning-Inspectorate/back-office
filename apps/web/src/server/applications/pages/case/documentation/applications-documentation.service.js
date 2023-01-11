import { get, patch, post } from '../../../../lib/request.js';

/**
 * @typedef {import('@pins/express').ValidationErrors} ValidationErrors
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
 * @param {{status: string, redacted: boolean, items: Array<{guid: string}>}} payload
 * @returns {Promise<{items?: Array<{guid: string}>, errors?: ValidationErrors}>}
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
			resolve({ errors: error?.response?.body?.errors || {} });
		});
	}

	return response;
};

/**
 * Get the blob storage file url for the file with the given GUID
 *
 * @param {number} caseId
 * @param {string} fileGuid
 * @returns {Promise<{documentUrl: string, fileGuid: string}>}
 */
export const getCaseDocumentationFileUrl = (caseId, fileGuid) => {
	// TODO: this is a just mock
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				fileGuid,
				documentUrl:
					'document-service-uploads/application/WS010001/5dcae922-15ba-459d-8d76-c68b66ff7c41/Screenshot%202022-07-28%20at%2009.25.48.png'
			});
		}, 200);
	});
};
