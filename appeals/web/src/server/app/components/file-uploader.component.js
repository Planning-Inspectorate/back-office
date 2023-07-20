import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import { post } from '../../lib/request.js';
import config from '@pins/appeals.web/environment/config.js';

/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('@pins/appeals/index.js').DocumentUploadInfo} DocumentUploadInfo */
/** @typedef {import('@pins/appeals/index.js').AddDocumentsRequest} AddDocumentsRequest */
/** @typedef {import('@pins/appeals/index.js').AddDocumentVersionRequest} AddDocumentVersionRequest */
/** @typedef {import('@pins/appeals/index.js').AddDocumentsResponse} AddDocumentsResponse */
/**
 * @param {string} caseId
 * @param {AddDocumentsRequest} payload
 * @returns {Promise<AddDocumentsResponse>}
 */
export const createNewDocument = async (caseId, payload) => {
	return post(`appeals/${caseId}/documents`, { json: payload });
};

/**
 * @param {string} caseId
 * @param {string} documentId
 * @param {AddDocumentVersionRequest} payload
 * @returns {Promise<AddDocumentsResponse>}
 */
export const createNewDocumentVersion = async (caseId, documentId, payload) => {
	return post(`appeals/${caseId}/documents/${documentId}`, { json: payload });
};

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string}, session: SessionWithAuth, body: AddDocumentsRequest}} request
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

	const documentsWithRowId = documents.map((document) => {
		if (document) {
			const fileToUpload = body.documents.find(
				(file) => file.documentName === document.documentName
			);
			const documentWithRowId = { ...document };
			documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

			return documentWithRowId;
		}
	});

	return response.send({ ...uploadInfo, documents: documentsWithRowId, accessToken });
}

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{params: {caseId: string, documentId: string}, session: SessionWithAuth, body: AddDocumentVersionRequest}} request
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

	const documentsWithRowId = documents.map((document) => {
		const fileToUpload = body.document;
		const documentWithRowId = { ...document };

		documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

		return documentWithRowId;
	});
	const document = documentsWithRowId[0];
	document.fileRowId = body?.document.fileRowId || '';

	return response.send({ ...uploadInfo, accessToken });
}
