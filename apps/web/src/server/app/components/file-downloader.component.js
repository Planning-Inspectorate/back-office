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
	const { guid: fileGuid, preview, caseId, version } = params;
	const { blobStorageUrl } = config;

	const accessToken = await getActiveDirectoryAccessToken(session);

	const { privateBlobContainer, privateBlobPath, fileName, originalFilename } =
		await getCaseDocumentationVersionFileInfo(caseId, fileGuid, version);

	console.error({ fileName, originalFilename });

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

	if (preview && blobProperties?.contentType) {
		response.setHeader('content-type', blobProperties.contentType);
	} else {
		const downloadFileName = buildFileName({ fileName, originalFilename });
		response.setHeader('content-disposition', `attachment; filename=${downloadFileName}`);
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

export default getDocumentsDownload;
