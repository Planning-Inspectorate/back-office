import { post } from '../../lib/request.js';
import * as authSession from '../auth/auth-session.service.js';

/** @typedef {import('../auth/auth-session.service')} AuthState */
/** @typedef {import('express-session').Session & AuthState} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {{documentName: string, fileRowId: string, blobStoreUrl?: string, failedReason?: string}} DocumentUploadInfo */
/** @typedef {{accessToken: AccessToken, blobStorageHost: string, blobStorageContainer: string, documents: DocumentUploadInfo[]}} UploadInfo */

/**
 * @param {string} caseId
 * @param {DocumentUploadInfo[]} payload
 * @returns {Promise<UploadInfo>}
 */
export const createNewDocument = async (caseId, payload) => {
	return post(`applications/${caseId}/documents`, { json: payload });
};

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string}, session: SessionWithAuth, body: DocumentUploadInfo[]}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postDocumentsUpload({ params, body, session }, response) {
	const { caseId } = params;
	const uploadInfo = await createNewDocument(caseId, body);
	const { documents } = uploadInfo;

	const sessionAccount = authSession.getAccount(session);

	if (sessionAccount) {
		// const {accessToken: token, expiresOnTimestamp} = sessionAccount;

		const accessToken = {
			token:
				'eyJ0eXAiOiJKV1QiLCJub25jZSI6IklrNXpVa1RZaHllaTN3RmFKdW9vXzZfNTJnLTV6dTgtSHlMVUJ3ZzktQ2MiLCJhbGciOiJSUzI1NiIsIng1dCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSIsImtpZCI6IjJaUXBKM1VwYmpBWVhZR2FYRUpsOGxWMFRPSSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC81ODc4ZGY5OC02Zjg4LTQ4YWItOTMyMi05OThjZTU1NzA4OGQvIiwiaWF0IjoxNjY4NzAyMzM1LCJuYmYiOjE2Njg3MDIzMzUsImV4cCI6MTY2ODcwNjcyOSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhUQUFBQWpWeVJiUmVQdFRsblpkbFpDb2pkOVlDRjlwdGxyaFdHdm1mQ1BnY2ZiejErTlNvUU9pUDArcjZwVlpqWFB3OFl1ZU5PMGU2ZjYxM2hXbWZSN0JiamdZZ2dGLzhweFRDb3pUZDYyUVJCcDR3PSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiQmFjayBPZmZpY2UgRGV2IiwiYXBwaWQiOiI3Y2FiODk3MS1jMzA1LTRiOWEtODJkYi0yMWI1ZmQ4NGVmYmQiLCJhcHBpZGFjciI6IjEiLCJmYW1pbHlfbmFtZSI6IlRhbWlnaW8iLCJnaXZlbl9uYW1lIjoiTHVkb3ZpY28iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI5MC4yMDMuODcuMTczIiwibmFtZSI6IlRhbWlnaW8sIEx1ZG92aWNvIiwib2lkIjoiZDI2ZTY3YjctMmNkYS00NDZiLWJkMzAtNDZiYzM0NGJkMzk2IiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMyMDAyMDZBQkNCNTciLCJyaCI6IjAuQVRFQW1OOTRXSWh2cTBpVElwbU01VmNJalFNQUFBQUFBQUFBd0FBQUFBQUFBQUF4QU00LiIsInNjcCI6ImVtYWlsIEdyb3VwTWVtYmVyLlJlYWQuQWxsIG9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCIsInN1YiI6InFPelFFXzJiYVlVcU9BV2paYnZvZUdLOHpsRmxfcmYzZEktcnVYQ0w5anMiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiRVUiLCJ0aWQiOiI1ODc4ZGY5OC02Zjg4LTQ4YWItOTMyMi05OThjZTU1NzA4OGQiLCJ1bmlxdWVfbmFtZSI6Ikx1ZG92aWNvLlRhbWlnaW9AcGxhbm5pbmdpbnNwZWN0b3JhdGUuZ292LnVrIiwidXBuIjoiTHVkb3ZpY28uVGFtaWdpb0BwbGFubmluZ2luc3BlY3RvcmF0ZS5nb3YudWsiLCJ1dGkiOiJrdkswampRNjMwLTFXd0lRZmE4V0FBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6Ilc1YzB0RWJrbkc4a0JFbXppRHR3Q3JZWWxEWXZQSVRMclQyZnAzSkVlVFEifSwieG1zX3RjZHQiOjE1MjAyNjg3OTd9.KEHb_sTEk79G0UgeDDAVOJecIMNXSbkQOsFBWmqNoLpSYnfEcpwFHQUTILbdFwuZ_e5AYXhyahkPp8Cvv9BKkUWueBgUnJYQOR4jISnsQOlGZFaob0JfPOg4_IaR0vk6H-Ol4QdkchSa-f5eOAjHKrbH2uHGY3ze6yA3VtCKmJIKz8C8SYfi05sDZqvIRZAzauzB3x1O0jJbQ6CTKsgLcoZUNyCkaDO1aHaYrTeG3aYh45UoEl8QKWnsICLNFtz25HjVnASQ-434OL3nHZlagGC-PQbzYtXoVapMjQdVdQdOxovkNnSOkytG6Fc5oTygmXWtaJq0rzxJi-xuuVEHOg',
			expiresOnTimestamp: 1_668_706_729_000
		};

		uploadInfo.documents = documents.map((document) => {
			const fileToUpload = body.find((file) => file.documentName === document.documentName);
			const documentWithRowId = { ...document };

			documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

			return documentWithRowId;
		});

		return response.send({ ...uploadInfo, accessToken });
	}

	return response.status(401).json({ msg: 'Error: no token found' });
}
