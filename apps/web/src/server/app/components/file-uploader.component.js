import * as got from 'got';
import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import { post } from '../../lib/request.js';
import { setSuccessBanner } from '../../applications/common/services/session.service.js';
// import { setSuccessBanner } from '../../applications/common/services/session.service.js';
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
 * @param {{body: { html: string }}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postProcessHTMLFile({ body }, response) {
	const { html } = body;

	try {
		const result = await post(`applications/documents/process-html`, { json: { html } });
		return response.send(result);
	} catch (/** @type {*} */ err) {
		if (err.response.statusCode === 400) {
			return response.status(400).send({ errors: 'BAD_HTML_FILE' });
		}

		return response.status(err.response.statusCode).send(err.response.body);
	}
}

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
 * @param {{session: SessionWithAuth, body: DocumentUploadInfo[]}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postDocumentsUpload({ body, session }, response) {
	const { caseId, adviceId } = response.locals;

	const payload = body.map((document) => {
		document.username = session.account?.name;
		return document;
	});

	let uploadInfo;
	try {
		// @ts-ignore
		uploadInfo = adviceId
			? await createS51AdviceDocuments(caseId, Number(adviceId), payload)
			: await createNewDocument(caseId, payload);
	} catch (err) {
		if (err instanceof got.HTTPError && err.response.statusCode === 409) {
			return response.status(409).send(err.response.body);
		}
		throw err;
	}

	const { documents } = uploadInfo;

	const accessToken = await getActiveDirectoryAccessToken(session);

	uploadInfo.documents = documents.map((document) => {
		const fileToUpload = body.find((file) => file.documentName === document.documentName);
		const documentWithRowId = { ...document };

		documentWithRowId.fileRowId = fileToUpload?.fileRowId || '';

		return documentWithRowId;
	});

	return response.send({ ...uploadInfo, accessToken });
}

/**
 * Generic controller for applications and appeals for files upload
 *
 * @param {*} request
 * @param {*} response
 * @returns {Promise<*>}
 */
export async function postUploadDocumentVersion(request, response) {
	const { session, body } = request;
	const { caseId, documentGuid } = response.locals;
	body.username = 'a'; //session.account?.name;

	const document = await createNewDocumentVersion(caseId, documentGuid, body);

	//const accessToken = await getActiveDirectoryAccessToken(session);

	document.fileRowId = body?.fileRowId || '';

	setSuccessBanner(session);

	//return response.send({ ...document, accessToken });
	return 0;
}
