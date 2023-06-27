import { post } from '../../../../lib/request.js';

/**
 *
 * @param {string} caseId
 * @param {string}  repId
 * @param {*} body
 * @return {Promise<any>}
 */
export const createRepresentationAttachment = async (caseId, repId, body) =>
	post(`applications/${caseId}/representations/${repId}/attachment`, {
		json: body
	});
