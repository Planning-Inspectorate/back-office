import config from './config.js';
import { requestWithApiKey } from '../common/backend-api-request.js';
import fetch from 'node-fetch';

/**
 * @param {string} caseReference
 * @returns {Promise<number | null>}
 * */
async function getCaseID(caseReference) {
	try {
		//TODO: remove local API call and replace with this one!!
		// const result = await requestWithApiKey
		// 	.get(`https://${config.apiHost}/applications/reference/${caseReference}`)
		// 	.json();

		const result = await fetch(`http://localhost:3000/applications/reference/${caseReference}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': '123',
				'x-service-name': 'backoffice-applications-api-key-function'
			}
		});

		const { id } = await result.json();

		return id;
	} catch (err) {
		throw new Error(`getCaseID failed for reference ${caseReference} with error: ${err}`);
	}
}

async function getAllFoldersOnCase(caseId) {
	try {
		//TODO: remove local API call and replace with this one!!
		// const result = await requestWithApiKey
		// 	.get(`https://${config.apiHost}/applications/${caseId}/folders?all=true`)
		// 	.json();

		const result = await fetch(`http://localhost:3000/applications/${caseId}/folders?all=true`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': '123',
				'x-service-name': 'backoffice-applications-api-key-function'
			}
		});

		return result.json();
	} catch (err) {
		throw new Error(`getAllFoldersOnCase failed for caseId ${caseId} with error: ${err}`);
	}
}

async function postDocuments(caseId, documents) {
	try {
		// return requestWithApiKey.post(
		// 	`https://${config.apiHost}/applications/${caseId}/representations`,
		// 	{
		// 		json: documents
		// 	}
		// );

		const result = await fetch(`http://localhost:3000/applications/${caseId}/documents`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': '123',
				'x-service-name': 'backoffice-applications-api-key-function'
			},
			body: JSON.stringify(documents)
		});

		return result.json();
	} catch (err) {
		throw new Error(`postDocuments failed for caseId ${caseId} with error: ${err}`);
	}
}

export default {
	getCaseID,
	getAllFoldersOnCase,
	postDocuments
};

//TODO: remove
//getCaseID('BC0110001').then((caseId) => console.log('caseId', caseId));
//getAllFoldersOnCase(100000000).then((folders) => console.log('folders', folders));
