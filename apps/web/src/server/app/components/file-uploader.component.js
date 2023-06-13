import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import { post } from '../../lib/request.js';
import config from '@pins/web/environment/config.js';

/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {{documentName: string, fileRowId: string, blobStoreUrl?: string, failedReason?: string}} DocumentUploadInfo */
/** @typedef {{accessToken: AccessToken, blobStorageHost: string, blobStorageContainer: string, documents: DocumentUploadInfo[]}} UploadInfo */
/** @typedef {'application'|'appeal'} domains */

/**
 * @param {domains} domain
 * @param {string} caseId
 * @param {DocumentUploadInfo[]} payload
 * @returns {Promise<UploadInfo>}
 */
export const createNewDocument = async (domain, caseId, payload) => {
	return post(`${domain}/${caseId}/documents`, { json: payload });
};

/**
 * @param {domains} domain
 * @param {string} caseId
 * @param {string} documentId
 * @param {DocumentUploadInfo} payload
 * @returns {Promise<DocumentUploadInfo>}
 */
export const createNewDocumentVersion = async (domain, caseId, documentId, payload) => {
	return post(`${domain}/${caseId}/document/${documentId}/add-version`, { json: payload });
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
 * @param {{params: {caseId: string, domain: domains}, session: SessionWithAuth, body: DocumentUploadInfo[]}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postDocumentsUpload({ params, body, session }, response) {
	const { caseId, domain } = params;
	const uploadInfo = await createNewDocument(domain, caseId, body);
	const { documents } = uploadInfo;

	let accessToken = null;
	if (!config.blobEmulatorSasUrl) {
		accessToken = await getActiveDirectoryAccessToken(session);
	}

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

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string, documentId: string, domain: domains}, session: SessionWithAuth, body: DocumentUploadInfo}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postUploadDocumentVersion({ params, body, session }, response) {
	const { domain, caseId, documentId } = params;

	const document = await createNewDocumentVersion(domain, caseId, documentId, body);

	const accessToken = await getActiveDirectoryAccessToken(session);

	document.fileRowId = body?.fileRowId || '';

	return response.send({ ...document, accessToken });
}
