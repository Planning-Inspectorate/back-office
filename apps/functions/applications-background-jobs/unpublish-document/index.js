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
	context.log(`Unpublishing document ID ${documentId} at URI ${publishedDocumentURI}`);

	if (!caseId || !documentId || !version) {
		const message = 'Unpublish execution aborted: One or more required properties are missing.';
		context.log.error(message, { documentId, caseId, version, publishedDocumentURI });
		throw new Error(message);
	}

	// Handle missing `publishedDocumentURI`
	if (!publishedDocumentURI) {
		if (
			typeof sourceSystem !== 'string' ||
			sourceSystem.trim() === '' ||
			sourceSystem.toLowerCase() === 'horizon'
		) {
			// If a document was migrated from Horizon, it was not published via the blob pipeline and has no publishedDocumentURI.
			// We skip the blob deletion step as there is no physical file to delete (avoiding URI parse and storage errors),
			// but proceed to mark the document as unpublished so it does not get stuck in the 'unpublishing' state.
			context.log(
				`No published blob URI for document ID ${documentId} originating from source "${
					!sourceSystem || sourceSystem.trim() === '' ? 'unknown/blank' : sourceSystem
				}"; skipping blob deletion.`
			);
		} else {
			// Non-Horizon documents missing a `publishedDocumentURI` are invalid - this is an unexpected error
			const message = `Unpublish execution aborted: Missing publishedDocumentURI for non-Horizon document (sourceSystem: "${sourceSystem}").`;
			context.log.error(message, { documentId, caseId, version, sourceSystem });
			throw new Error(message);
		}
	} else {
		// Non-Horizon documents must have a `publishedDocumentURI` to delete from the published container

		// Replace PINs domain with primary blob domain to ensure copy operation works
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
			context.log.error(errMsg, { err, documentId, caseId, version, publishedBlobName });
			throw new Error(errMsg, { cause: err });
		}
	}

	// Make API request to transition document status in database to 'unpublished'
	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-unpublished`;

	context.log(`Unpublishing version ${version} of document ${documentId} for case ${caseId}`);

	let unpublishedDocument;
	try {
		unpublishedDocument = await requestWithApiKey.post(requestUri).json();
	} catch (error) {
		const message = 'Unpublish execution failed: Unable to mark document as unpublished via API.';
		context.log.error(message, { error, documentId, caseId, version, requestUri });
		throw new Error(message, { cause: error });
	}

	if (isGisBoundaryGeoJsonDocument(unpublishedDocument)) {
		context.log(`Rebuilding master GeoJson after unpublishing GIS boundary ${documentId}`);

		try {
			await rebuildMasterGeoJson(context.log);
		} catch (error) {
			context.log.error(
				`Failed to rebuild master GeoJson after unpublishing GIS boundary ${documentId}`,
				{ error, documentId, caseId, version }
			);
		}
	}
};
