import { BlobStorageClient } from '@pins/blob-storage-client';
import config from '../../../../environment/config.js';
import { getCaseDocumentationFileInfo } from '../../applications/case/documentation/applications-documentation.service.js';
import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';

/** @typedef {import('../auth/auth-session.service').SessionWithAuth} SessionWithAuth */
/** @typedef {import('express').Response} Response */

/**
 * Download one document or redirects to its url if preview is active
 *
 * @param {{params: {caseId: number, guid: string, preview?: string}, session: SessionWithAuth}} request
 * @param {Response} response
 * @returns {Promise<Response>}
 */
const getDocumentsDownload = async ({ params, session }, response) => {
	const { guid: fileGuid, preview, caseId } = params;
	const { blobStorageUrl } = config;

	const accessToken = await getActiveDirectoryAccessToken(session);

	const { blobStorageContainer, documentURI } = await getCaseDocumentationFileInfo(
		caseId,
		fileGuid
	);

	if (!blobStorageContainer || !documentURI) {
		throw new Error('Blob storage container or Document UR not found');
	}

	// Document URIs are persisted with a prepended slash, but this slash is treated as part of the key by blob storage so we need to remove it
	const documentKey = documentURI.startsWith('/') ? documentURI.slice(1) : documentURI;

	const fileName = `${documentKey}`.split(/\/+/).pop();

	const client = BlobStorageClient.fromUrlAndToken(blobStorageUrl, accessToken);

	const blobProperties = await client.getBlobProperties(blobStorageContainer, documentKey);

	if (!blobProperties) {
		return response.status(404);
	}

	if (preview && blobProperties?.contentType) {
		response.setHeader('content-type', blobProperties.contentType);
	} else {
		response.setHeader('content-disposition', `attachment; filename=${fileName}`);
	}

	const blobStream = await client.downloadStream(blobStorageContainer, documentKey);

	if (!blobStream?.readableStreamBody) {
		throw new Error(`Document ${documentKey} missing stream body`);
	}

	blobStream.readableStreamBody?.pipe(response);

	return response.status(200);
};

export default getDocumentsDownload;
