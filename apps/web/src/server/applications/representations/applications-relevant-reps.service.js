import { get } from '../../lib/request.js';

/**
 * @param {string} caseId
 * @param {string} queryString
 * @returns {Promise<any>}
 */
export const getRepresentations = async (caseId, queryString) => {
	return get(`applications/${caseId}/representations?${queryString}`);
};

/**
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export const getCase = async (caseId) => {
	return get(`applications/${caseId}`);
};
