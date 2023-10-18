import got from 'got';
import config from './config.js';
import { blobClient } from './blob-client.js';
import { parseBlobName } from './utils.js';

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

	await got.post(requestUri);
};
