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
	// If a document was migrated from Horizon without a source blob, it will have no documentURI.
	// We can skip publishing because there is no physical file to copy, avoiding a crash when trying to parse the URI.
	if (
		!documentURI &&
		(typeof sourceSystem !== 'string' ||
			sourceSystem.trim() === '' ||
			sourceSystem.toLowerCase() === 'horizon')
	) {
		context.log(
			`Skipping publish execution: Document originating from source "${
				!sourceSystem || sourceSystem.trim() === '' ? 'unknown source' : sourceSystem
			}" lacks a documentURI.`
		);
		return;
	}

	context.log(`Publishing document ID ${documentId} at URI ${documentURI}`);

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
		context.log.error(message, { documentId, caseId, version, documentURI });
		throw new Error(message);
	}

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
	const publishFileName = buildPublishedFileName({
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
