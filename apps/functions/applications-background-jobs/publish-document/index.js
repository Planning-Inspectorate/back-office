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
	if (
		!documentURI &&
		(typeof sourceSystem !== 'string' ||
			sourceSystem.trim() === '' ||
			sourceSystem.toLowerCase() === 'horizon')
	) {
		context.log(
			`Skipping publish execution: Document originating from source "${sourceSystem}" lacks a documentURI.`
		);
		return;
	}

	context.log(`Initiating publish execution for document ID ${documentId} at URI ${documentURI}`);

	// replace PINs domain with primary blob domain to ensure copy operation works
	documentURI = replaceCustomDomainWithBlobDomain(documentURI);

	if (
		!caseId ||
		!documentId ||
		!version ||
		!documentURI ||
		!filename ||
		!originalFilename ||
		!documentReference ||
		!mime
	) {
		const message = 'Publish execution aborted: One or more required properties are missing.';
		context.log.error(message, { documentId, caseId, version });
		throw new Error(message);
	}

	let publishFileName;
	try {
		if (await isScannedFileHtml(documentURI)) {
			context.log('Scanned file identified as HTML; executing validity check');
			const isValidHtml = await isUploadedHtmlValid(documentURI, context.log);
			if (!isValidHtml) {
				await handleHtmlValidityFail(documentURI, context.log);
				throw new Error(
					`Publish execution aborted for caseId ${caseId}: HTML validation failed. File marked as malicious.`
				);
			}
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
			`Copying source blob from ${documentURI} to destination ${publishFileName} for caseId ${caseId}`
		);

		await blobClient.copyFileFromUrl({
			sourceUrl: documentURI,
			destinationContainerName: config.BLOB_PUBLISH_CONTAINER,
			destinationBlobName: publishFileName,
			newContentType: mime
		});
	} catch (error) {
		const message =
			'Publish execution failed: Encountered error during preparation or blob copy operation.';
		context.log.error(message, { error, documentId, caseId, version });
		throw new Error(message, { cause: error });
	}

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-published`;

	context.log(
		`Initiating POST request to ${requestUri} for caseId ${caseId}, documentId ${documentId}, version ${version}`
	);

	let publishedDocument;

	// Check is to maintain original publishing date when migrating docs from ODW
	// - remove after migration is done, just keep contents of 'else' statement
	try {
		if (context.bindingData?.applicationProperties?.migrationPublishing) {
			publishedDocument = await requestWithApiKey
				.post(requestUri, {
					json: {
						publishedBlobContainer: config.BLOB_PUBLISH_CONTAINER,
						publishedBlobPath: publishFileName
					}
				})
				.json();
		} else {
			publishedDocument = await requestWithApiKey
				.post(requestUri, {
					json: {
						publishedBlobContainer: config.BLOB_PUBLISH_CONTAINER,
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
		context.log(
			`Initiating master GeoJSON rebuild following successful publication of GIS boundary document ${documentId}`
		);

		try {
			await rebuildMasterGeoJson(context.log);
		} catch (error) {
			context.log.error(
				'GeoJSON Rebuild failed: Encountered error while rebuilding master GeoJSON following GIS boundary publication',
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
