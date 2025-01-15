import logger from '../../../lib/logger.js';
import { deleteRequest, get, patch, post } from '../../../lib/request.js';

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
 * @param {{status: string, redacted?: boolean, documents: Array<{guid: string}>}} payload
 * @returns {Promise<{documents?: Array<{guid: string}>, errors?: {guid: string, msg: string}[]}>}
 */
export const updateCaseDocumentationFiles = async (caseId, { status, redacted, documents }) => {
	try {
		return await patch(`applications/${caseId}/documents`, {
			json: {
				status,
				redacted,
				documents
			}
		});
	} catch (/** @type {*} */ error) {
		return { errors: error?.response?.body?.errors || [] };
	}
};

/**
 * Update folderId for a documents to 'move it' to another folder
 * @param {number} caseId
 * @param {{destinationFolderId: number|undefined, destinationFolderStage: string|undefined|null, documents: {documentGuid: string, fileName: string, version: number}[]}} _
 * @returns
 * */
export const updateDocumentsFolderId = async (
	caseId,
	{ documents, destinationFolderId, destinationFolderStage }
) => {
	try {
		return await patch(`applications/${caseId}/move-documents`, {
			json: {
				documents,
				destinationFolderId,
				destinationFolderStage
			}
		});
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknow error'}`);
		return { errors: { msg: 'One or more of your documents cannot be moved' } };
	}
};

/**
 * @param {number} caseId
 * @param {string[]} documentGuids
 * @returns {Promise<{errors: {guid: string, msg: string}[]}>};
 * */
export const unpublishCaseDocumentationFiles = async (caseId, documentGuids) => {
	try {
		return await patch(`applications/${caseId}/documents/unpublish`, {
			json: {
				documents: documentGuids.map((guid) => ({ guid }))
			}
		});
	} catch (/** @type {*} */ error) {
		return { errors: error?.response?.body?.errors || [] };
	}
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
 * @param {number} caseId
 * @param {string[]} filesGuid
 * @returns {Promise<DocumentationFile[]>}
 */
export const getCaseManyDocumentationFilesInfo = async (
	caseId,
	filesGuid,
	onlyPublished = false
) => {
	return get(
		`applications/${caseId}/documents/properties?guids=${JSON.stringify(
			filesGuid
		)}&published=${onlyPublished}`
	);
};

/**
 * Get the blob storage info for the file with the given GUID
 * Warning: This function does not return newest versions of the documents
 *
 * @param {number} caseId
 * @param {string} fileGuid
 * @param {number} version
 * @returns {Promise<DocumentationFile>}
 */
export const getCaseDocumentationVersionFileInfo = async (caseId, fileGuid, version = 1) => {
	return get(`applications/${caseId}/documents/${fileGuid}/version/${version}/properties`);
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
 * @param {{guid: string}[]} documents
 * @param {string} username
 * @returns {Promise<{documents?: Array<{guid: string}>, errors?: any}>}
 */
export const publishCaseDocumentationFiles = async (caseId, documents, username) => {
	try {
		const payload = {
			documents,
			username
		};

		const publishedDocuments = await patch(`applications/${caseId}/documents/publish`, {
			json: payload
		});

		return { documents: publishedDocuments };
	} catch (/** @type {*} */ error) {
		// log out the actual publishing errors
		logger.error(`[API] ${error?.response?.body?.errors || 'Unknow error'}`);
		return { errors: { msg: 'Your documents could not be published, please try again' } };
	}
};

/**
 * Returns a paginated list of documents on a case, matching passed search criteria
 *
 * @param {number} caseId
 * @param {string} query
 * @param {number} pageNumber
 * @returns {Promise<{searchResult?: PaginatedDocumentationFiles, errors?: {msg: string }}>}
 */
export const searchDocuments = async (caseId, query, pageNumber) => {
	try {
		const searchResult = await get(
			`applications/${caseId}/documents?page=${pageNumber}&pageSize=25&criteria=${query}`
		);
		return { searchResult };
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);
		return { errors: { msg: 'Your search could not be carried out, try again.' } };
	}
};

/**
 * @param {number} caseId
 * @param {string} name
 * @param {number} [parentFolderId]
 * @returns {Promise<{ folder?: DocumentationCategory, errors?: {msg: string} }>}
 * */
export const createFolder = async (caseId, name, parentFolderId) => {
	try {
		return await post(`applications/${caseId}/folders/create-folder`, {
			json: {
				name,
				parentFolderId
			}
		});
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);
		if (error.response.statusCode === 409) {
			return { errors: { msg: 'Folder name already exists' } };
		}
		return { errors: { msg: 'Failed to create folder.' } };
	}
};

/**
 * @param {number} caseId
 * @param {number} folderId
 * @param {string} name
 * @returns {Promise<{ folder?: DocumentationCategory, errors?: {msg: string} }>}
 * */
export const renameFolder = async (caseId, folderId, name) => {
	try {
		return await patch(`applications/${caseId}/folders/${folderId}`, {
			json: { name }
		});
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unknown error'}`);
		if (error.response.statusCode === 405) {
			return { errors: { msg: 'This folder cannot be renamed.' } };
		}

		return { errors: { msg: 'Failed to rename folder.' } };
	}
};

/**
 *
 * @param {number} caseId
 * @param {number} folderId
 * @returns
 */
export const deleteFolder = async (caseId, folderId) => {
	try {
		return await deleteRequest(`applications/${caseId}/folders/${folderId}`);
	} catch (/** @type {*} */ error) {
		logger.error(`[API] ${JSON.stringify(error?.response?.body?.errors) || 'Unkown error'}`);
		if (error?.response?.statusCode === 403) {
			return { errors: { msg: 'Cannot delete a non-custom folder' } };
		}
		if (error?.response?.statusCode === 409) {
			return { errors: { msg: 'Folder or child folders are not empty' } };
		}
		return { errors: { msg: 'Failed to rename folder.' } };
	}
};
