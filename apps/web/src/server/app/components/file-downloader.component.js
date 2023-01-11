import { request } from 'node:https';
import config from '../../../../environment/config.js';
import { getCaseDocumentationFileUrl } from '../../applications/pages/case/documentation/applications-documentation.service.js';
import createSasToken from '../../lib/sas-token.js';

/**
 * Download one document or redirects to its url if preview is active
 *
 * @param {{params: {guid: string, preview?: string}}} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
const getDocumentsDownload = async ({ params }, response) => {
	const { guid: fileGuid, preview } = params;
	const { blobStorageUrl } = config;
	const sasToken = await createSasToken();
	const { documentUrl } = await getCaseDocumentationFileUrl(fileGuid);
	const completeURI = `${blobStorageUrl}${documentUrl}${sasToken}`;

	if (preview) {
		response.redirect(completeURI);
	} else {
		const fileName = `${documentUrl}`.split(/\/+/).pop();
		const externalRequest = request(completeURI, (externalResource) => {
			response.setHeader('content-disposition', `attachment; filename=${fileName}`);
			externalResource.pipe(response);
		});

		externalRequest.end();
	}
};

export default getDocumentsDownload;
