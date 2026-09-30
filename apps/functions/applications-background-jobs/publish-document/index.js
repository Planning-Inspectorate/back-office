import { requestWithApiKey } from '../common/backend-api-request.js';
import {
	buildPublishedFileName,
	validateStorageAccount,
	replaceCustomDomainWithBlobDomain
} from './src/util.js';
import { isScannedFileHtml, isUploadedHtmlValid } from '../common/html-validation.js';
import { handleHtmlValidityFail } from './src/handle-html-validity-fail.js';
import { isGisBoundaryGeoJsonDocument } from '../common/util.js';
import { rebuildMasterGeoJson } from '../common/master-geojson.js';
import config from '../common/config.js';
import { blobClient } from '../common/blob-client.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (
	context,
	{
		caseId,
		documentId,
		version,
		documentURI,
		documentReference,
		filename,
		originalFilename,
		mime,
		sourceSystem
	}
) => {
	context.log(`Publishing document ID ${documentId} at URI ${documentURI}`);

	if (!caseId || !documentId || !version) {
		const message = 'Publish execution aborted: One or more required properties are missing.';
		context.log.error(message, { documentId, caseId, version, documentURI });
		throw new Error(message);
	}

	// `publishFileName` and `publishedBlobContainer` are only available in non-Horizon migrated
	// documents. They will be `null` for Horizon migrated documents as they were copied to the
	// published container during migration.
	let publishFileName = null;
	let publishedBlobContainer = null;

	// Handle missing documentURI
	if (!documentURI) {
		if (
			typeof sourceSystem !== 'string' ||
			sourceSystem.trim() === '' ||
			sourceSystem.toLowerCase() === 'horizon'
		) {
			// If a document was migrated from Horizon without a source blob, it will have no documentURI.
			// We skip the blob copy step as there is no physical file to copy (avoiding URI parse and storage errors),
			// but proceed to mark the document as published so it does not get stuck in the 'publishing' state.
			context.log(
				`No source blob URI for document ID ${documentId} originating from source "${
					!sourceSystem || sourceSystem.trim() === '' ? 'unknown/blank' : sourceSystem
				}"; skipping blob copy.`
			);
		} else {
			// Non-Horizon documents missing a `documentURI` are invalid - this is an unexpected error
			const message = `Publish execution aborted: Missing documentURI for non-Horizon document (sourceSystem: "${sourceSystem}").`;
			context.log.error(message, { documentId, caseId, version, sourceSystem });
			throw new Error(message);
		}
	} else {
		// Non-Horizon documents must have a `documentURI` to be copied to the publish container
		if (!filename || !originalFilename || !documentReference || !mime) {
			const message = 'Publish execution aborted: One or more required properties are missing.';
			context.log.error(message, { documentId, caseId, version, documentURI });
			throw new Error(message);
		}

		// Replace PINs domain with primary blob domain to ensure copy operation works
		documentURI = replaceCustomDomainWithBlobDomain(documentURI);

		try {
			if (await isScannedFileHtml(documentURI)) {
				context.log('Scanned file is HTML, performing validity check');
				const isValidHtml = await isUploadedHtmlValid(documentURI, context.log);
				if (!isValidHtml) {
					await handleHtmlValidityFail(documentURI, context.log);
					throw Error(
						`Publishing failed for caseId ${caseId} due to HTML file failing validity check. File marked as malicious`
					);
				}
			}
		} catch (error) {
			const message = 'Publish execution failed: Encountered error during HTML validity check.';
			context.log.error(message, { error, documentId, caseId, version, documentURI });
			throw new Error(message, { cause: error });
		}

		validateStorageAccount(documentURI);
		publishFileName = buildPublishedFileName({
			documentReference,
			filename,
			originalFilename
		});

		// Normalise and encode source URL (e.g. spaces in generated GeoJSON filenames)
		// so Storage SDK copy operations receive a valid URL.
		documentURI = new URL(documentURI).toString();

		context.log(
			`Deploying source blob ${documentURI} to destination ${publishFileName} for caseId ${caseId}`
		);

		let copyStatus;
		try {
			copyStatus = await blobClient.copyFileFromUrl({
				sourceUrl: documentURI,
				destinationContainerName: config.BLOB_PUBLISH_CONTAINER,
				destinationBlobName: publishFileName,
				newContentType: mime
			});

			if (copyStatus === 'failed' || copyStatus === 'aborted') {
				throw new Error(`Blob copy operation did not succeed. Status: ${copyStatus}`);
			}
		} catch (error) {
			const message =
				'Publish execution failed: Encountered error during preparation or blob copy operation.';
			context.log.error(message, { error, documentId, caseId, version });
			throw new Error(message, { cause: error });
		}

		publishedBlobContainer = config.BLOB_PUBLISH_CONTAINER;
	}

	// Mark document as published via API.
	// Always executed — even for Horizon docs without a source blob — so the document
	// is not left stuck in the 'publishing' state. publishedBlobPath and
	// publishedBlobContainer will be null for those documents.
	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-published`;

	context.log(`Publishing version ${version} of document ${documentId} for case ${caseId}`);

	let publishedDocument;

	try {
		// Check is to maintain original publishing date when migrating docs from ODW
		// - remove after migration is done, just keep contents of 'else' statement
		if (context.bindingData?.applicationProperties?.migrationPublishing) {
			publishedDocument = await requestWithApiKey
				.post(requestUri, {
					json: {
						publishedBlobContainer,
						publishedBlobPath: publishFileName
					}
				})
				.json();
		} else {
			publishedDocument = await requestWithApiKey
				.post(requestUri, {
					json: {
						publishedBlobContainer,
						publishedBlobPath: publishFileName,
						publishedDate: new Date()
					}
				})
				.json();
		}
	} catch (error) {
		const message = 'Publish execution failed: Unable to mark document as published via API.';
		context.log.error(message, { error, documentId, caseId, version, requestUri });
		throw new Error(message, { cause: error });
	}

	if (isGisBoundaryGeoJsonDocument(publishedDocument)) {
		context.log(`Rebuilding master GeoJson after publishing GIS boundary ${documentId}`);

		try {
			await rebuildMasterGeoJson(context.log);
		} catch (error) {
			context.log.error(
				`Failed to rebuild master GeoJson after publishing GIS boundary ${documentId}`,
				{ error, documentId, caseId, version }
			);
		}
	}
};
