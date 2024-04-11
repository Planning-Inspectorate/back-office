import { validateStorageAccount, replaceCustomDomainWithBlobDomain } from '../publish-document/src/util.js';
import { requestWithApiKey } from '../common/backend-api-request.js';
import { blobClient } from '../common/blob-client.js';
import config from '../common/config.js';
import { extractPublishedBlobName } from './src/util.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, { caseId, documentId, version, publishedDocumentURI }) => {
	context.log(`Unpublishing document ID ${documentId} at URI ${publishedDocumentURI}`);

	if (
		!caseId ||
		!documentId ||
		!version ||
		!publishedDocumentURI
	) {
		throw Error('One or more required properties are missing.');
	}

	// replace PINs domain with primary blob domain to ensure copy operation works
	publishedDocumentURI = replaceCustomDomainWithBlobDomain(publishedDocumentURI);

	validateStorageAccount(publishedDocumentURI);

	// extract the published file name
	const publishedBlobName = extractPublishedBlobName(publishedDocumentURI);

	try {
		context.log(`deleting blob (if exists) in container "${config.BLOB_PUBLISH_CONTAINER}" with name "${publishedBlobName}"`);
		await blobClient.deleteBlobIfExists(config.BLOB_PUBLISH_CONTAINER, publishedBlobName);
	} catch (err) {
		const errMsg = `encountered error while unpublishing document ID ${documentId}: ${err}`;
		context.log.error(errMsg);
		throw new Error(errMsg);
	}

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-unpublished`;

	context.log(`Making POST request to ${requestUri}`);

	await requestWithApiKey.post(requestUri);
};
