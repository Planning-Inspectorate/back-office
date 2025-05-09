import config from './config.js';
import { requestWithApiKey } from '../common/backend-api-request.js';

/** @typedef {{ id: number, displayNameEn: string }} FolderJSON */

/**
 * @param {string} caseReference
 * @returns {Promise<number | null>}
 * */
async function getCaseID(caseReference) {
	try {
		const result = await requestWithApiKey
			.get(`https://${config.apiHost}/applications/reference/${caseReference}`)
			.json();

		return result.id;
	} catch (err) {
		throw new Error(`getCaseID failed for reference ${caseReference} with error: ${err}`);
	}
}

/**
 * @params {object} representation
 * @returns {Promise<any>} response
 */
async function postRepresentation(caseId, representation) {
	try {
		return requestWithApiKey.post(
			`https://${config.apiHost}/applications/${caseId}/representations`,
			{
				json: representation
			}
		);
	} catch (err) {
		throw new Error(`postRepresentation failed for caseId ${caseId} with error: ${err}`);
	}
}

export default {
	getCaseID,
	postRepresentation
};
