import { BlobStorageClient } from '@pins/blob-storage-client';
import config from '../../../../environment/config.js';
import { getCaseDocumentationVersionFileInfo } from '../../applications/case/documentation/applications-documentation.service.js';
import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';

/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('express').Response} Response */

/**
 * Download one document or redirects to its url if preview is active
 *
 * @param {{params: {caseId: number, guid: string, preview?: string, version: number}, session: SessionWithAuth}} request
 * @param {Response} response
 * @returns {Promise<Response>}
 */
const getDocumentsDownload = async ({ params, session }, response) => {
	const { preview } = params;
	const { fileGuid, caseId, version } = response.locals;

	const { blobStorageUrl } = config;

	const accessToken = await getActiveDirectoryAccessToken(session);

	const {
		privateBlobContainer,
		privateBlobPath,
		fileName,
		originalFilename,
		mime: contentType
	} = await getCaseDocumentationVersionFileInfo(caseId, fileGuid, version);

	// perform simulated download if auth disabled
	if (accessToken?.token === 'AUTH_DISABLED') {
		return getSimulatedDocumentsDownload(response, preview, fileName, originalFilename);
	}

	if (!privateBlobContainer || !privateBlobPath) {
		throw new Error('Blob storage container or Document UR not found');
	}

	// Document URIs are persisted with a prepended slash, but this slash is treated as part of the key by blob storage so we need to remove it
	const documentKey = privateBlobPath.startsWith('/') ? privateBlobPath.slice(1) : privateBlobPath;

	const client = BlobStorageClient.fromUrlAndToken(blobStorageUrl, accessToken);

	const blobProperties = await client.getBlobProperties(privateBlobContainer, documentKey);

	if (!blobProperties) {
		return response.status(404);
	}

	if (contentType) {
		response.setHeader('content-type', contentType);
	}

	if (!preview) {
		const downloadFileName = buildFileName({ fileName, originalFilename });

		response.setHeader('content-disposition', buildContentDispositionHeader(downloadFileName));
	}

	const blobStream = await client.downloadStream(privateBlobContainer, documentKey);

	if (!blobStream?.readableStreamBody) {
		throw new Error(`Document ${documentKey} missing stream body`);
	}

	blobStream.readableStreamBody?.pipe(response);

	return response.status(200);
};

const fileExtensionRegex = /\.[0-9a-z]+$/i;

/**
 *
 * @param {{fileName: string, originalFilename: string}} params
 */
const buildFileName = ({ fileName, originalFilename }) => {
	const originalExtension = originalFilename.match(fileExtensionRegex)?.[0];
	const newExtension = fileName.match(fileExtensionRegex)?.[0];

	return originalExtension === newExtension ? fileName : `${fileName}${originalExtension}`;
};

/**
 * Build a content-disposition header value for a file download, ensuring that the filename is correctly encoded for special characters
 *
 * @param {string} fileName
 * @returns {string}
 */
export const buildContentDispositionHeader = (fileName) => {
	const encodedFilename = encodeURIComponent(fileName);

	const fallbackFilename = fileName.replace(/[^\x20-\x7E\xA0-\xFF]/g, '-'); // Replace non-ASCII characters with hyphens

	//we use `filename*` and URI encoding to ensure that the filename is correctly handling special characters
	//that will be passed as filenames into the header
	//and use `filename` as a fallback for clients that don't support `filename*`
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Disposition
	return `attachment; filename="${fallbackFilename}"; filename*=UTF-8''${encodedFilename}`;
};

/**
 * Simulate download when auth is disabled
 *
 * This is useful both when developing and running e2e locally to skip having to set up any blob storage configuration
 *
 * @param {Response} response
 * @param {string | undefined} preview
 * @param {string} fileName
 * @param {string} originalFilename
 * @returns {*}
 */
export const getSimulatedDocumentsDownload = (response, preview, fileName, originalFilename) => {
	if (preview) {
		response.setHeader('Content-type', 'text/plain');
	} else {
		const downloadFileName = buildFileName({ fileName, originalFilename });

		response.setHeader('content-disposition', buildContentDispositionHeader(downloadFileName));
	}
	response.charset = 'UTF-8';
	response.write('DUMMY DATA');
	response.end();
	return response.status(200);
};

export default getDocumentsDownload;
