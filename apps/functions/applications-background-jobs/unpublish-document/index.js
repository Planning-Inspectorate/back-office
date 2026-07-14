import {
	validateStorageAccount,
	replaceCustomDomainWithBlobDomain
} from '../publish-document/src/util.js';
import { requestWithApiKey } from '../common/backend-api-request.js';
import { blobClient } from '../common/blob-client.js';
import config from '../common/config.js';
import { extractPublishedBlobName } from './src/util.js';
import { isGisBoundaryGeoJsonDocument } from '../common/util.js';
import { rebuildMasterGeoJson } from '../common/master-geojson.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, { caseId, documentId, version, publishedDocumentURI }) => {
	context.log(`Unpublishing document ID ${documentId} at URI ${publishedDocumentURI}`);

	if (!caseId || !documentId || !version || !publishedDocumentURI) {
		throw Error('One or more required properties are missing.');
	}

	// replace PINs domain with primary blob domain to ensure copy operation works
	publishedDocumentURI = replaceCustomDomainWithBlobDomain(publishedDocumentURI);

	validateStorageAccount(publishedDocumentURI);

	// extract the published file name
	const publishedBlobName = extractPublishedBlobName(publishedDocumentURI);

	try {
		context.log(
			`deleting blob (if exists) in container "${config.BLOB_PUBLISH_CONTAINER}" with name "${publishedBlobName}" for caseId ${caseId}`
		);
		await blobClient.deleteBlobIfExists(config.BLOB_PUBLISH_CONTAINER, publishedBlobName);
	} catch (err) {
		const errMsg = `encountered error while unpublishing document ID ${documentId} for caseId ${caseId}: ${err}`;
		context.log.error(errMsg);
		throw new Error(errMsg);
	}

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-unpublished`;

	context.log(`Making POST request to ${requestUri} for caseId ${caseId}`);

	const unpublishedDocument = await requestWithApiKey.post(requestUri).json();

	if (isGisBoundaryGeoJsonDocument(unpublishedDocument)) {
		context.log(`Rebuilding master GeoJson after unpublishing GIS boundary ${documentId}`);

		try {
			await rebuildMasterGeoJson(context.log);
		} catch (error) {
			context.log.error(
				`Failed to rebuild master GeoJson after unpublishing GIS boundary ${documentId}: ${error}`
			);
		}
	}
};
