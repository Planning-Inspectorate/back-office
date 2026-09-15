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
import { logError } from '../common/log-error.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (
	context,
	{ caseId, documentId, version, publishedDocumentURI, sourceSystem }
) => {
	if (
		typeof sourceSystem !== 'string' ||
		sourceSystem.trim() === '' ||
		sourceSystem.toLowerCase() === 'horizon'
	) {
		return;
	}

	context.log(`Unpublishing document ID ${documentId} at URI ${publishedDocumentURI}`);

	if (!caseId || !documentId || !version || !publishedDocumentURI) {
		const message = 'One or more required properties are missing.';
		context.log.error(message, { documentId, caseId, version });
		throw Error(message);
	}

	let publishedBlobName;
	try {
		// replace PINs domain with primary blob domain to ensure copy operation works
		publishedDocumentURI = replaceCustomDomainWithBlobDomain(publishedDocumentURI);

		validateStorageAccount(publishedDocumentURI);

		// extract the published file name
		publishedBlobName = extractPublishedBlobName(publishedDocumentURI);

		context.log(
			`deleting blob (if exists) in container "${config.BLOB_PUBLISH_CONTAINER}" with name "${publishedBlobName}" for caseId ${caseId}`
		);
		await blobClient.deleteBlobIfExists(config.BLOB_PUBLISH_CONTAINER, publishedBlobName);
	} catch (err) {
		throw logError(context, 'Failed to delete published blob', err, {
			documentId,
			caseId,
			version,
			publishedBlobName
		});
	}

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-unpublished`;

	context.log(`Making POST request to ${requestUri} for caseId ${caseId}`);

	let unpublishedDocument;
	try {
		unpublishedDocument = await requestWithApiKey.post(requestUri).json();
	} catch (error) {
		throw logError(context, 'Failed to mark document as unpublished', error, {
			documentId,
			caseId,
			version,
			requestUri
		});
	}

	if (isGisBoundaryGeoJsonDocument(unpublishedDocument)) {
		context.log(`Rebuilding master GeoJson after unpublishing GIS boundary ${documentId}`);

		try {
			await rebuildMasterGeoJson(context.log);
		} catch (error) {
			logError(context, 'Failed to rebuild master GeoJson after unpublishing GIS boundary', error, {
				documentId,
				caseId,
				version
			});
		}
	}
};
