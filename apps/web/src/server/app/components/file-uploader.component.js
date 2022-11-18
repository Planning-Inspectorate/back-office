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

	if (sessionAccount?.accessToken) {
		const { accessToken: token, expiresOnTimestamp } = sessionAccount;
		const accessToken = { token, expiresOnTimestamp };

		uploadInfo.documents = documents.map((document) => {
			const fileToUpload = body.find((file) => file.documentName === document.documentName);
			const documentWithRowId = { ...document };

			documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

			return documentWithRowId;
		});

		return response.send({ ...uploadInfo, accessToken });
	}
	return response.status(401).json({ error: 'ACCESS_TOKEN_NOT_FOUND' });
}
