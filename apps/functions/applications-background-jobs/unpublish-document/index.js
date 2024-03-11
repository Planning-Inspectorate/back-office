import { parseBlobName } from './utils.js';
import { requestWithApiKey } from '../common/backend-api-request.js';
import { blobClient } from '../common/blob-client.js';
import config from '../common/config.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, { caseId, version, documentId, documentURI }) => {
	context.log(`Unpublishing document ID ${documentId} at URI ${documentURI}`);

	const blobName = parseBlobName(documentURI);
	if (!blobName) {
		throw new Error(`could not parse blob name from document URI: ${documentURI}`);
	}

	try {
		await blobClient.deleteBlobIfExists(config.BLOB_PUBLISH_CONTAINER, blobName);
	} catch (err) {
		const errMsg = `encountered error while unpublishing document ID ${documentId}: ${err}`;
		context.log.error(errMsg);
		throw new Error(errMsg);
	}

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-unpublished`;

	context.log(`Making POST request to ${requestUri}`);

	await requestWithApiKey.post(requestUri);
};
