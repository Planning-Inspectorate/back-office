import getActiveDirectoryAccessToken from '#lib/active-directory-token.js';
import config from '@pins/appeals.web/environment/config.js';
import logger from '#lib/logger.js';

/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {import('@pins/appeals/index.js').AddDocumentsRequest} AddDocumentsRequest */
/** @typedef {import('@pins/appeals/index.js').AddDocumentVersionRequest} AddDocumentVersionRequest */
/** @typedef {import('@pins/appeals/index.js').AddDocumentsResponse} AddDocumentsResponse */

/**
 * @param {import('got').Got} apiClient
 * @param {string} caseId
 * @param {AddDocumentsRequest} payload
 * @returns {Promise<AddDocumentsResponse|undefined>}
 */
export const createNewDocument = async (apiClient, caseId, payload) => {
	try {
		return await apiClient.post(`appeals/${caseId}/documents`, { json: payload }).json();
	} catch (error) {
		logger.error(
			error,
			error instanceof Error
				? error.message
				: 'An error occurred while attempting to patch the documents API endpoint'
		);
		throw error;
	}
	//return await apiClient.post(`appeals/${caseId}/documents`, { json: payload }).json();
};

/**
 * @param {import('got').Got} apiClient
 * @param {string} caseId
 * @param {string} documentId
 * @param {AddDocumentVersionRequest} payload
 * @returns {Promise<AddDocumentsResponse>}
 */
export const createNewDocumentVersion = async (apiClient, caseId, documentId, payload) => {
	return apiClient.post(`appeals/${caseId}/documents/${documentId}`, { json: payload }).json();
};

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{apiClient: import('got').Got, params: {caseId: string}, session: SessionWithAuth, body: AddDocumentsRequest}} request
 * @param {*} response
 * @returns {Promise<{}|undefined>}
 */
export async function postDocumentsUpload({ apiClient, params, body, session }, response) {
	try {
		const { caseId } = params;
		const uploadInfo = await createNewDocument(apiClient, caseId, body);

		if (uploadInfo) {
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
	} catch (/** @type {Object<any, any>} */ error) {
		logger.error(error);
		return response.send({
			error: {
				code: error.response?.statusCode || 500,
				body: error.response?.body?.errors?.body || null
			}
		});
	}
}

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {{apiClient: import('got').Got, params: {caseId: string, documentId: string}, session: SessionWithAuth, body: AddDocumentVersionRequest}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postUploadDocumentVersion({ apiClient, params, body, session }, response) {
	const { caseId, documentId } = params;
	const uploadInfo = await createNewDocumentVersion(apiClient, caseId, documentId, body);
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

	return response.send({ ...uploadInfo, documents: documentsWithRowId, accessToken });
}
