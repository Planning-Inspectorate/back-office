import { get, patch } from '../../../lib/request.js';

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

/**
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export const getPublishableRepresentaions = async (caseId) =>
	get(`applications/${caseId}/representations/publishable`);

/**
 * @param {string} caseId
 * @param {object} payload
 * @returns {Promise<any>}
 */
export const publishRepresentations = async (caseId, payload) =>
	patch(`applications/${caseId}/representations/publish`, payload);
