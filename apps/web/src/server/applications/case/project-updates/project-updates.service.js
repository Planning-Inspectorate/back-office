import { get } from '../../../lib/request.js';

/**
 * @param {string} caseId
 * @param {string} queryString
 * @returns {Promise<any>}
 */
export const getProjectUpdates = async (caseId, queryString) => {
	return get(`applications/${caseId}/project-updates?${queryString}`);
};
