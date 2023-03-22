import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import { post } from '../../lib/request.js';

/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
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
 * Remove extension from document name
 *
 * @param {string} documentNameWithExtension
 * @returns {string}
 */
export const documentName = (documentNameWithExtension) => {
	if (!documentNameWithExtension.includes('.')) return documentNameWithExtension;

	const documentNameSplit = documentNameWithExtension.split('.');

	documentNameSplit.pop();

	return documentNameSplit.join('.');
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

	const accessToken = await getActiveDirectoryAccessToken(session);

	uploadInfo.documents = documents.map((document) => {
		const fileToUpload = body.find(
			(file) => documentName(file.documentName) === document.documentName
		);
		const documentWithRowId = { ...document };

		documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

		return documentWithRowId;
	});

	return response.send({ ...uploadInfo, accessToken });
}
