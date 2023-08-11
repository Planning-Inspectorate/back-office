/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */

/**
 * @template T
 * @param {import('got').Got} apiClient
 * @param {string} caseId
 * @param {string} folderId
 * @returns {Promise<Folder|undefined>}
 */
export const getFolder = async (apiClient, caseId, folderId) => {
	try {
		const locationInfo = await apiClient
			.get(`appeals/${caseId}/document-folders/${folderId}`)
			.json();
		return locationInfo;
	} catch {
		return undefined;
	}
};

/**
 * @param {import('got').Got} apiClient
 * @param {string} caseId
 * @param {string} fileGuid
 * @returns {Promise<Document|undefined>}
 */
export const getFileInfo = async (apiClient, caseId, fileGuid) => {
	try {
		const fileInfo = await apiClient.get(`appeals/${caseId}/documents/${fileGuid}`).json();
		return fileInfo;
	} catch {
		return undefined;
	}
};
