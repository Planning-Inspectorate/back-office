import { BlobServiceClient } from '@azure/storage-blob';
import { BlobStorageClient } from '@pins/blob-storage-client';
import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import { get } from '../../lib/request.js';
import config from '@pins/appeals.web/environment/config.js';

/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('express').Response} Response */

/**
 * Download one document or redirects to its url if preview is active
 *
 * @param {{params: {caseId: number, guid: string, preview?: string}, session: SessionWithAuth}} request
 * @param {Response} response
 * @returns {Promise<Response>}
 */
const getDocumentDownload = async ({ params, session }, response) => {
	const { guid: fileGuid, preview, caseId } = params;

	const fileInfo = await get(`appeals/${caseId}/documents/${fileGuid}`);
	const { blobStorageContainer, documentURI } = fileInfo.latestDocumentVersion;
	if (!blobStorageContainer || !documentURI) {
		throw new Error('Blob storage container or Blob storage path not found');
	}

	let blobStorageClient = undefined;
	let accessToken = undefined;
	if (config.useBlobEmulator !== true) {
		accessToken = await getActiveDirectoryAccessToken(session);
		blobStorageClient = BlobStorageClient.fromUrlAndToken(config.blobStorageUrl, accessToken);
	} else {
		blobStorageClient = new BlobStorageClient(new BlobServiceClient(config.blobEmulatorSasUrl));
	}

	// Document URIs are persisted with a prepended slash, but this slash is treated as part of the key by blob storage so we need to remove it
	const documentKey = documentURI.startsWith('/') ? documentURI.slice(1) : documentURI;
	const fileName = `${documentKey}`.split(/\/+/).pop();

	const blobProperties = await blobStorageClient.getBlobProperties(
		blobStorageContainer,
		documentKey
	);
	if (!blobProperties) {
		return response.status(404);
	}

	if (preview && blobProperties?.contentType) {
		response.setHeader('content-type', blobProperties.contentType);
	} else {
		response.setHeader('content-disposition', `attachment; filename=${fileName}`);
	}

	const blobStream = await blobStorageClient.downloadStream(blobStorageContainer, documentKey);

	if (!blobStream?.readableStreamBody) {
		throw new Error(`Document ${documentKey} missing stream body`);
	}

	blobStream.readableStreamBody?.pipe(response);

	return response.status(200);
};

export default getDocumentDownload;
