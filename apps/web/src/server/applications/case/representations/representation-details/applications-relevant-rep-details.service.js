import { get } from '../../../../lib/request.js';
import { getCaseFolders } from '../../documentation/applications-documentation.service.js';

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
 * @param {string} caseId
 * @return {Promise<*>}
 */
export const getRelevantRepFolder = async (caseId) => {
	const folders = await getCaseFolders(Number(caseId));
	return folders.find((folder) => folder.displayNameEn === 'Relevant representations');
};
