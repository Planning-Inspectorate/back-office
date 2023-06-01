import { get, patch, post } from '../../../../lib/request.js';
import { getRepresentationContactPayload } from './representation.utilities.js';

/**
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export const getCase = async (caseId) => {
	return get(`applications/${caseId}`);
};

/**
 * @param {string} caseId
 * @param {string} repId
 * @returns {Promise<any>}
 */
export const getRepresentation = async (caseId, repId) => {
	return get(`applications/${caseId}/representations/${repId}`);
};

/**
 * @param {string} caseId
 * @param {string} repType
 * @param {object} body
 * @returns {Promise<any>}
 */
export const postRepresentation = async (caseId, repType, body) =>
	post(`applications/${caseId}/representations/`, getRepresentationContactPayload(repType, body));

/**
 * @param {string} caseId
 * @param {string} repId
 * @param {string} repType
 * @param {object} body
 * @returns {Promise<any>}
 */
export const patchRepresentation = async (caseId, repId, repType, body) =>
	patch(
		`applications/${caseId}/representations/${repId}`,
		getRepresentationContactPayload(repType, body)
	);

/**
 * @param {string} caseId
 * @param {string} repId
 * @param {string} repType
 * @param {object} body
 * @returns {Promise<any>}
 */
export const patchRepresentationNoMap = async (caseId, repId, repType, body) =>
	patch(`applications/${caseId}/representations/${repId}`, {
		json: body
	});
