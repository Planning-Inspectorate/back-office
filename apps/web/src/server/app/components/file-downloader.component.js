import { request } from 'node:https';
import config from '../../../../environment/config.js';
import { getCaseDocumentationFileInfo } from '../../applications/case/documentation/applications-documentation.service.js';
import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import createSasToken from '../../lib/sas-token.js';

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

	const { blobStorageContainer, blobStoragePath } = await getCaseDocumentationFileInfo(
		caseId,
		fileGuid
	);

	if (!blobStorageContainer || !blobStoragePath) {
		throw new Error('Blobstorage container or blobStorage path not found');
	}

	const sasToken = await createSasToken(
		accessToken,
		blobStorageContainer,
		blobStoragePath.slice(1)
	);
	const completeURI = `${blobStorageUrl}${blobStorageContainer}${blobStoragePath}${sasToken}`;
	const fileName = `${blobStoragePath}`.split(/\/+/).pop();

	const externalRequest = request(completeURI, (externalResource) => {
		const contentType = externalResource.headers['content-type'];

		if (preview && contentType) {
			response.setHeader('content-type', contentType);
		} else {
			response.setHeader('content-disposition', `attachment; filename=${fileName}`);
		}
		externalResource.pipe(response);
	});

	externalRequest.end();

	return response.status(200);
};

export default getDocumentsDownload;
