import * as got from 'got';
import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import { post } from '../../lib/request.js';
import { setSuccessBanner } from '../../applications/common/services/session.service.js';
/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
/** @typedef {{documentName: string, fileRowId: string, blobStoreUrl?: string, username?: string, name?: string}} DocumentUploadInfo */
/** @typedef {{accessToken: AccessToken, blobStorageHost: string, privateBlobContainer: string, documents: DocumentUploadInfo[]}} UploadInfo */
/** @typedef {{hexSignature: string, offset: number}} HexSignature */

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
 * Validate file signatures using
 *
 * @param {{body: []}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postValidateFileSignatures({ body }, response) {
	// TODO: Replace all the "XXXX" withe the actual expected signature
	const fileSignatures = {
		/* See the following link for reference: https://www.garykessler.net/library/file_sigs.html */
		/* .pdf  */ 'application/pdf': { hexSignature: '255044462D' },
		/* .doc  */ 'application/msword': { hexSignature: 'D0CF11E0' },
		/* .docx */ 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
			hexSignature: '504B03041400'
		},
		/* .ppt  */ 'application/vnd.ms-powerpoint': { hexSignature: 'D0CF11E0' },
		/* .pptx */ 'application/vnd.openxmlformats-officedocument.presentationml.presentation': {
			hexSignature: 'D0CF11E0'
		},
		/* .xls  */ 'application/vnd.ms-excel': { hexSignature: 'D0CF11E0' },
		/* .xlsx */ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
			hexSignature: '504B03041400'
		},
		/* .jpg  */ 'image/jpeg': { hexSignature: 'FFD8FFE0' },
		/* .msg  */ 'application/vnd.ms-outlook': { hexSignature: 'D0CF11E0' },
		/* .mpeg */ 'video/mpeg': { hexSignature: '000001B3, 000001BA' },
		/* .mp3  */ 'audio/mpeg': { hexSignature: 'FFFB, 494433' },
		/* .mp4  */ 'video/mp4': { hexSignature: '66747970', offset: 8 },
		/* .mov  */ 'video/quicktime': { hexSignature: '0000001466747970' },
		/* .png  */ 'image/png': { hexSignature: '89504E47' },
		/* .tif  */ 'image/tiff': { hexSignature: '4D4D002A, 49492A00' }, // 2 possible magic numbers here
		/* .html */ 'text/html': { hexSignature: '0A3C212D2D207361' },
		/* .prj  */ 'application/x-anjuta-project': { hexSignature: '' },
		/* .dbf  */ 'application/dbf': { hexSignature: '4F504C4461746162, 61736546696C65' },
		/* .shp  */ 'application/vnd.shp': { hexSignature: '' },
		/* .shx  */ 'application/vnd.shx': { hexSignature: '' }
		// Add more file signatures as needed
	};
	const invalidSignatures = body
		.filter(({ fileType, hexSignature = '' }) => {
			const /** @type {HexSignature} */ validFileType = fileSignatures[fileType];
			if (!validFileType) {
				return true; // Fail when filetype not supported
			}
			if (validFileType.hexSignature.length === 0) {
				return false; // Pass when valid hexSignature is blank
			}
			const offset = validFileType.offset ?? 0;
			return !validFileType.hexSignature
				.split(',')
				.some((magicNumber) => hexSignature.substring(offset).startsWith(magicNumber.trim()));
		})
		.map(({ fileRowId }) => fileRowId);
	return response.send({ invalidSignatures });
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
 * @param {{session: SessionWithAuth, body: DocumentUploadInfo}} request
 * @param {*} response
 * @returns {Promise<{}>}
 */
export async function postUploadDocumentVersion(request, response) {
	const { session, body } = request;
	const { caseId, documentGuid } = response.locals;
	body.username = session.account?.name;

	const document = await createNewDocumentVersion(caseId, documentGuid, body);

	const accessToken = await getActiveDirectoryAccessToken(session);

	document.fileRowId = body?.fileRowId || '';

	setSuccessBanner(session);

	return response.send({ ...document, accessToken });
}
