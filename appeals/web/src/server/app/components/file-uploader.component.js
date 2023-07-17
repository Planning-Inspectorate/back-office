import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import { post } from '../../lib/request.js';
import config from '@pins/appeals.web/environment/config.js';

/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('@pins/appeals/index.js').DocumentUploadInfo} DocumentUploadInfo */
/** @typedef {import('@pins/appeals/index.js').UploadInfo} UploadInfo */
/** @typedef {import('@pins/appeals/index.js').DocumentApiRequest} DocumentApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentVersionApiRequest} DocumentVersionApiRequest */
/**
 * @param {string} caseId
 * @param {DocumentApiRequest} payload
 * @returns {Promise<UploadInfo>}
 */
export const createNewDocument = async (caseId, payload) => {
	return post(`appeals/${caseId}/documents`, { json: payload });
};

/**
 * @param {string} caseId
 * @param {string} documentId
 * @param {DocumentVersionApiRequest} payload
 * @returns {Promise<UploadInfo>}
 */
export const createNewDocumentVersion = async (caseId, documentId, payload) => {
	return post(`appeals/${caseId}/documents/${documentId}`, { json: payload });
};

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string}, session: SessionWithAuth, body: DocumentApiRequest}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postDocumentsUpload({ params, body, session }, response) {
	const { caseId } = params;
	const uploadInfo = await createNewDocument(caseId, body);
	const { documents } = uploadInfo;

	let accessToken = undefined;
	if (config.useBlobEmulator !== true) {
		accessToken = await getActiveDirectoryAccessToken(session);
	}

	uploadInfo.documents = documents.map((document) => {
		const fileToUpload = body.documents.find((file) => file.documentName === document.documentName);
		const documentWithRowId = { ...document };

		documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

		return documentWithRowId;
	});

	return response.send({ ...uploadInfo, accessToken });
}

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string, documentId: string}, session: SessionWithAuth, body: DocumentVersionApiRequest}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postUploadDocumentVersion({ params, body, session }, response) {
	const { caseId, documentId } = params;
	const uploadInfo = await createNewDocumentVersion(caseId, documentId, body);
	const { documents } = uploadInfo;

	let accessToken = undefined;
	if (config.useBlobEmulator !== true) {
		accessToken = await getActiveDirectoryAccessToken(session);
	}

	uploadInfo.documents = documents.map((document) => {
		const fileToUpload = body.document;
		const documentWithRowId = { ...document };

		documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

		return documentWithRowId;
	});
	const document = uploadInfo.documents[0];
	document.fileRowId = body?.document.fileRowId || '';

	return response.send({ ...uploadInfo, accessToken });
}
