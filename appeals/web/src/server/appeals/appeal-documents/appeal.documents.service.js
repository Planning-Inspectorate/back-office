import { get } from '../../lib/request.js';
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */

/**
 * @param {string} caseId
 * @param {string} folderId
 * @returns {Promise<Folder|undefined>}
 */
export const getFolder = async (caseId, folderId) => {
	try {
		const locationInfo = await get(`appeals/${caseId}/document-folders/${folderId}`);
		return locationInfo;
	} catch {
		return undefined;
	}
};

/**
 * @param {string} caseId
 * @param {string} fileGuid
 * @returns {Promise<Document|undefined>}
 */
export const getFileInfo = async (caseId, fileGuid) => {
	try {
		const fileInfo = await get(`appeals/${caseId}/documents/${fileGuid}`);
		return fileInfo;
	} catch {
		return undefined;
	}
};
