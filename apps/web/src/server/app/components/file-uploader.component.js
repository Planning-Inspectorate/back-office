import * as got from 'got';
import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import { post } from '../../lib/request.js';
import { setSuccessBanner } from '../../applications/common/services/session.service.js';
/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {{documentName: string, fileRowId: string, blobStoreUrl?: string, username?: string, name?: string}} DocumentUploadInfo */
/** @typedef {{accessToken: AccessToken, blobStorageHost: string, privateBlobContainer: string, documents: DocumentUploadInfo[]}} UploadInfo */

/**
 * @param {string} caseId
 * @param {DocumentUploadInfo[]} payload
 * @returns {Promise<UploadInfo>}
 */
export const createNewDocument = async (caseId, payload) => {
	return post(`applications/${caseId}/documents`, { json: payload });
};

/**
 * @param {string} caseId
 * @param {number} adviceId
 * @param {DocumentUploadInfo[]} payload
 * @returns {Promise<UploadInfo>}
 */
export const createS51AdviceDocuments = async (caseId, adviceId, payload) => {
	return post(`applications/${caseId}/s51-advice/${adviceId}/documents`, { json: payload });
};

/**
 * @param {string} caseId
 * @param {string} documentId
 * @param {DocumentUploadInfo} payload
 * @returns {Promise<DocumentUploadInfo>}
 */
export const createNewDocumentVersion = async (caseId, documentId, payload) => {
	return post(`applications/${caseId}/document/${documentId}/add-version`, { json: payload });
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
 * @param {{params: {caseId: string, adviceId: string}, session: SessionWithAuth, body: DocumentUploadInfo[]}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postDocumentsUpload({ params, body, session }, response) {
	const { caseId, adviceId } = params;

	const payload = body.map((document) => {
		document.username = session.account?.name;
		return document;
	});

	let uploadInfo;
	try {
		// @ts-ignore
		if (adviceId) {
			uploadInfo = await createS51AdviceDocuments(caseId, Number(adviceId), payload);
		} else {
			uploadInfo = await createNewDocument(caseId, payload);
		}
	} catch (err) {
		if (!(err instanceof got.HTTPError) || err.response.statusCode !== 409) {
			throw err;
		}

		return response.status(409).send(err.response.body);
	}

	const { documents } = uploadInfo;

	try {
		const accessToken = await getActiveDirectoryAccessToken(session);

		uploadInfo.documents = documents.map((document) => {
			const fileToUpload = body.find((file) => file.documentName === document.documentName);
			const documentWithRowId = { ...document };

			documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

			return documentWithRowId;
		});

		return response.send({ ...uploadInfo, accessToken });
	} catch {
		return response.status(500).send({ errors: { msg: 'An error occured. Try again later.' } });
	}
}

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string, documentId: string}, session: SessionWithAuth, body: DocumentUploadInfo}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postUploadDocumentVersion({ params, body, session }, response) {
	const { caseId, documentId } = params;
	body.username = session.account?.name;

	const document = await createNewDocumentVersion(caseId, documentId, body);

	const accessToken = await getActiveDirectoryAccessToken(session);

	document.fileRowId = body?.fileRowId || '';

	setSuccessBanner(session);

	return response.send({ ...document, accessToken });
}
