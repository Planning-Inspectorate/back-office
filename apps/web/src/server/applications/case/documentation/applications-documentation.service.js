import { fixtureDocumentationFiles } from '@pins/web/testing/applications/fixtures/documentation-files.js';
import { get, patch, post } from '../../../lib/request.js';

/**
 * @typedef {import('@pins/express').ValidationErrors} ValidationErrors
 * @typedef {import('../../applications.types').DocumentationCategory} DocumentationCategory
 * @typedef {import('../../applications.types').DocumentationFile} DocumentationFile
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
 * Get the blob storage info for the file with the given GUID
 *
 * @param {number} caseId
 * @param {string} fileGuid
 * @returns {Promise<DocumentationFile>}
 */
export const getCaseDocumentationFileInfo = async (caseId, fileGuid) => {
	// TODO: remove this and replace is the function below
	return get(`applications/${caseId}/documents/${fileGuid}`);
};

/**
 * Get the blob storage info for the file with the given GUID
 *
 * @param {number} caseId
 * @param {string} fileGuid
 * @returns {Promise<*>}
 */
export const getCaseDocumentationFileInfoMOCKED = async (caseId, fileGuid) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ ...fixtureDocumentationFiles[0], caseId, fileGuid });
		}, 500);
	});
};

/**
 * Soft delete the documentation file
 *
 * @param {number} caseId
 * @param {string} fileGuid
 * @param {string} documentName
 * @returns {Promise<{isDeleted?: boolean, errors?: ValidationErrors}>}
 */
export const deleteCaseDocumentationFile = async (caseId, fileGuid, documentName) => {
	let response;

	try {
		response = await post(`applications/${caseId}/documents/${fileGuid}/delete`);
	} catch {
		response = new Promise((resolve) => {
			resolve({ errors: { msg: `${documentName} could not be deleted, please try again.` } });
		});
	}

	return response;
};
