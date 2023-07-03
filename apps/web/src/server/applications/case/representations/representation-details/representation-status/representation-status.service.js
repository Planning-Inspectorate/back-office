import { patch } from '../../../../../lib/request.js';

/**
 *
 * @param {string} caseId
 * @param {string} representationId
 * @param {object} payload
 * @returns {Promise<any>}
 */
export const patchRepresentationStatus = async (caseId, representationId, payload) =>
	await patch(`applications/${caseId}/representations/${representationId}/status`, {
		json: payload
	});
