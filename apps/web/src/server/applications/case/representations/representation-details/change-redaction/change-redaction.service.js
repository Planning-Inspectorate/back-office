import { patch } from '../../../../../lib/request.js';

/**
 * @param {string} caseId
 * @param {string} representationId
 * @param {*} payload
 * @returns {Promise<any>}
 */
export const patchRepresentationDetailsChangeRedaction = async (
	caseId,
	representationId,
	payload
) => {
	return patch(`applications/${caseId}/representations/${representationId}`, {
		json: payload
	});
};
