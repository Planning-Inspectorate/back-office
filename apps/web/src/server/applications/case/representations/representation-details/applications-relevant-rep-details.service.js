import { getCaseFolders } from '../../documentation/applications-documentation.service.js';
import { get, patch } from '../../../../lib/request.js';

/**
 * @param {string} caseId
 * @param {string} representationId
 * @returns {Promise<any>}
 */
export const getRepresentationDetails = async (caseId, representationId) => {
	return get(`applications/${caseId}/representations/${representationId}`);
};

/**
 *
 * @param {number} caseId
 * @return {Promise<*>}
 */
export const getRelevantRepFolder = async (caseId) => {
	const folders = await getCaseFolders(caseId);
	return folders.find((folder) => folder.displayNameEn === 'Relevant representations');
};

/**
 * @param {string} caseId
 * @param {string} representationId
 * @param {object} body
 * @returns {Promise<any>}
 */
export const patchRepresentation = async (caseId, representationId, body) => {
	return patch(`applications/${caseId}/representations/${representationId}`, {
		json: body
	});
};
