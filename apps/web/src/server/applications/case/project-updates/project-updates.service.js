import { get, post } from '../../../lib/request.js';

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
 * @param {*} update
 * @returns {Promise<any>}
 */
export async function createProjectUpdate(caseId, update) {
	return post(`applications/${caseId}/project-updates`, {
		json: update
	});
}
