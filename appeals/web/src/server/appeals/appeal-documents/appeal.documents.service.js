import logger from '#lib/logger.js';

/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.DocumentRedactionStatus} DocumentRedactionStatus */

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} folderId
 * @returns {Promise<Folder|undefined>}
 */
export const getFolder = async (apiClient, appealId, folderId) => {
	try {
		const locationInfo = await apiClient
			.get(`appeals/${appealId}/document-folders/${folderId}`)
			.json();
		return locationInfo;
	} catch {
		return undefined;
	}
};

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} fileGuid
 * @returns {Promise<Document|undefined>}
 */
export const getFileInfo = async (apiClient, appealId, fileGuid) => {
	try {
		const fileInfo = await apiClient.get(`appeals/${appealId}/documents/${fileGuid}`).json();
		return fileInfo;
	} catch {
		return undefined;
	}
};

/**
 * @param {import('got').Got} apiClient
 * @returns {Promise<DocumentRedactionStatus[]|undefined>}
 */
export const getDocumentRedactionStatuses = async (apiClient) => {
	try {
		return await apiClient.get('appeals/document-redaction-statuses').json();
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'An error occurred while attempting to get document redaction statuses from the API'
		);
	}
};

/**
 * @typedef {Object} DocumentDetailsAPIDocument
 * @property {string} id
 * @property {string} receivedDate
 * @property {number} redactionStatus
 */

/**
 * @typedef {Object} DocumentDetailsAPIPatchRequest
 * @property {DocumentDetailsAPIDocument[]} documents
 */

/**
 * @typedef {Object} DocumentDetailsAPIPatchResponse
 * @property {DocumentDetailsAPIDocument[]} documents
 */

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {DocumentDetailsAPIPatchRequest} documentDetails
 * @returns {Promise<DocumentDetailsAPIPatchResponse|undefined>}
 */
export const updateDocuments = async (apiClient, appealId, documentDetails) => {
	try {
		return await apiClient
			.patch(`appeals/${appealId}/documents`, {
				json: documentDetails
			})
			.json();
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'An error occurred while attempting to patch the documents API endpoint'
		);
	}
};
