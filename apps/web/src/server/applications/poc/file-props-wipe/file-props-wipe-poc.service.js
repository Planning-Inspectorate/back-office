import { get, post } from '../../../lib/request.js';

/**
 * Fetch document version properties by GUID.
 *
 * @param {string} caseId
 * @param {string} documentGuid
 * @returns {Promise<object>}
 */
export async function getDocumentProperties(caseId, documentGuid) {
	return get(`applications/${caseId}/documents/${documentGuid}/properties`);
}

/**
 * Fetch documents in a folder, sorted by most recently created.
 *
 * @param {string} caseId
 * @param {string} folderId
 * @returns {Promise<object>}
 */
export async function getFolderDocuments(caseId, folderId) {
	return get(
		`applications/${caseId}/folders/${folderId}/documents?pageSize=1&pageNumber=1&sortBy=-dateCreated`
	);
}

/**
 * Delete a document by GUID.
 *
 * @param {string} caseId
 * @param {string} documentGuid
 * @returns {Promise<object>}
 */
export async function deleteDocument(caseId, documentGuid) {
	return post(`applications/${caseId}/documents/${documentGuid}/delete`);
}
