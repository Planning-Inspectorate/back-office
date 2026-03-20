import config from './config.js';
import { requestWithApiKey } from '../common/backend-api-request.js';

/**
 * @param {string} caseReference
 * @returns {Promise<number | null>}
 * */
async function getCaseID(caseReference) {
	try {
		const reqUrl = `https://${config.API_HOST}/applications/reference/${caseReference}`;
		const result = await requestWithApiKey.get(reqUrl).json();

		return result.id;
	} catch (err) {
		throw new Error(
			`getCaseID failed for reference ${caseReference}. Host: ${config.API_HOST}, with error: ${err}`
		);
	}
}

async function getAllFoldersOnCase(caseId) {
	try {
		const result = await requestWithApiKey
			.get(`https://${config.API_HOST}/applications/${caseId}/folders?all=true`)
			.json();

		return result;
	} catch (err) {
		throw new Error(`getAllFoldersOnCase failed for caseId ${caseId} with error: ${err}`);
	}
}

async function postDocuments(caseId, documents) {
	try {
		return await requestWithApiKey.post(
			`https://${config.API_HOST}/applications/${caseId}/documents`,
			{
				json: documents
			}
		);
	} catch (err) {
		throw new Error(`postDocuments failed for caseId ${caseId} with error: ${err}`);
	}
}

export default {
	getCaseID,
	getAllFoldersOnCase,
	postDocuments
};
