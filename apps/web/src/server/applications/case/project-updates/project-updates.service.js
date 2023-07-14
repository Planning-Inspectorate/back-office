import { get, post, patch } from '../../../lib/request.js';

/**
 * @param {string} caseId
 * @param {string} queryString
 * @returns {Promise<any>}
 */
export async function getProjectUpdates(caseId, queryString) {
	return get(`applications/${caseId}/project-updates?${queryString}`);
}

/**
 * @param {string} caseId
 * @param {string} id
 * @returns {Promise<any>}
 */
export async function getProjectUpdate(caseId, id) {
	return get(`applications/${caseId}/project-updates/${id}`);
}

/**
 * @param {string} caseId
 * @param {*} update
 * @returns {Promise<any>}
 */
export async function createProjectUpdate(caseId, update) {
	return post(`applications/${caseId}/project-updates`, {
		json: update
	});
}

/**
 * @param {string} caseId
 * @param {string} id
 * @param {*} update
 * @returns {Promise<any>}
 */
export async function patchProjectUpdate(caseId, id, update) {
	return patch(`applications/${caseId}/project-updates/${id}`, {
		json: update
	});
}
