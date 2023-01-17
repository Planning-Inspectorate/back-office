import { request } from 'node:https';
import config from '../../../../environment/config.js';
import { getCaseDocumentationFileUrl } from '../../applications/pages/case/documentation/applications-documentation.service.js';
import getActiveDirectoryAccessToken from '../../lib/active-directory-token.js';
import pino from '../../lib/logger.js';
import createSasToken from '../../lib/sas-token.js';

/** @typedef {import('@azure/core-auth').AccessToken} AccessToken */
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

	/** @type {AccessToken} */
	const accessToken = await getActiveDirectoryAccessToken(session);

	pino.info('access token from download:');
	pino.info(accessToken?.token);

	const { blobStorageContainer, blobStoragePath } = await getCaseDocumentationFileUrl(
		caseId,
		fileGuid
	);

	const sasToken = await createSasToken(
		accessToken,
		blobStorageContainer,
		blobStoragePath.slice(1)
	);
	const completeURI = `${blobStorageUrl}${blobStorageContainer}${blobStoragePath}${sasToken}`;

	if (preview) {
		response.redirect(completeURI);
	} else {
		const fileName = `${blobStoragePath}`.split(/\/+/).pop();
		const externalRequest = request(completeURI, (externalResource) => {
			response.setHeader('content-disposition', `attachment; filename=${fileName}`);
			externalResource.pipe(response);
		});

		externalRequest.end();
	}
	return response.status(200);
};

export default getDocumentsDownload;
