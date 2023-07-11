import { get } from '../../lib/request.js';

export const getFolderLayout = async (/** @type {string} */ caseId) => {
	try {
		const locationInfo = await get(`appeals/${caseId}/document-locations`);
		return locationInfo;
	} catch {
		return undefined;
	}
};

export const getFileInfo = async (/** @type {string} */ caseId, /** @type {string} */ fileGuid) => {
	try {
		const fileInfo = await get(`appeals/${caseId}/documents/${fileGuid}`);
		return fileInfo;
	} catch {
		return undefined;
	}
};
