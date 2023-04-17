import { get } from '../../../lib/request.js';

/**
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export const getRepresentations = async (caseId) => {
	return get(`applications/${caseId}/representations`);
};

/**
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export const getCase = async (caseId) => {
	return get(`applications/${caseId}`);
};
