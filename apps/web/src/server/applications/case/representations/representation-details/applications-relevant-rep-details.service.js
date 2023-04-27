import { get } from '../../../../lib/request.js';

/**
 * @param {string} caseId
 * @param {string} representationId
 * @returns {Promise<any>}
 */
export const getRepresentationDetails = async (caseId, representationId) => {
	return get(`applications/${caseId}/representations/${representationId}`);
};
