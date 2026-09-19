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
export const index = async (
	context,
	{ caseId, documentId, version, publishedDocumentURI, sourceSystem }
) => {
	if (
		!publishedDocumentURI &&
		(typeof sourceSystem !== 'string' ||
			sourceSystem.trim() === '' ||
			sourceSystem.toLowerCase() === 'horizon')
	) {
		context.log(
			`Skipping unpublish execution: Document originating from source "${sourceSystem}" lacks a publishedDocumentURI.`
		);
		return;
	}

	context.log(
		`Initiating unpublish execution for document ID ${documentId} at URI ${publishedDocumentURI}`
	);

	if (!caseId || !documentId || !version || !publishedDocumentURI) {
		const message = 'Unpublish execution aborted: One or more required properties are missing.';
		context.log.error(message, { documentId, caseId, version });
		throw new Error(message);
	}

	let publishedBlobName;
	try {
		// replace PINs domain with primary blob domain to ensure copy operation works
		publishedDocumentURI = replaceCustomDomainWithBlobDomain(publishedDocumentURI);

		validateStorageAccount(publishedDocumentURI);

		// extract the published file name
		publishedBlobName = extractPublishedBlobName(publishedDocumentURI);

		context.log(
			`Attempting deletion of blob "${publishedBlobName}" (if exists) in container "${config.BLOB_PUBLISH_CONTAINER}" for caseId ${caseId}`
		);
		await blobClient.deleteBlobIfExists(config.BLOB_PUBLISH_CONTAINER, publishedBlobName);
	} catch (err) {
		const message =
			'Unpublish execution failed: Encountered error while attempting to delete published blob.';
		context.log.error(message, { err, documentId, caseId, version, publishedBlobName });
		throw new Error(message, { cause: err });
	}

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-unpublished`;

	context.log(
		`Initiating POST request to ${requestUri} for caseId ${caseId}, documentId ${documentId}, version ${version}`
	);

	let unpublishedDocument;
	try {
		unpublishedDocument = await requestWithApiKey.post(requestUri).json();
	} catch (error) {
		const message = 'Unpublish execution failed: Unable to mark document as unpublished via API.';
		context.log.error(message, { error, documentId, caseId, version, requestUri });
		throw new Error(message, { cause: error });
	}

	if (isGisBoundaryGeoJsonDocument(unpublishedDocument)) {
		context.log(
			`Initiating master GeoJSON rebuild following unpublication of GIS boundary document ${documentId}`
		);

		try {
			await rebuildMasterGeoJson(context.log);
		} catch (error) {
			context.log.error(
				'GeoJSON Rebuild failed: Encountered error while rebuilding master GeoJSON following GIS boundary unpublication',
				{
					error,
					documentId,
					caseId,
					version
				}
			);
		}
	}
};
