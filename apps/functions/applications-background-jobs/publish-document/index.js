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
	{ caseId, documentId, version, documentURI, documentReference, filename, originalFilename, mime }
) => {
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
		throw Error('One or more required properties are missing.');
	}

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

	validateStorageAccount(documentURI);
	const publishFileName = buildPublishedFileName({
		documentReference,
		filename,
		originalFilename
	});

	context.log(
		`Deploying source blob ${documentURI} to destination ${publishFileName} for caseId ${caseId}`
	);

	await blobClient.copyFileFromUrl({
		sourceUrl: documentURI,
		destinationContainerName: config.BLOB_PUBLISH_CONTAINER,
		destinationBlobName: publishFileName,
		newContentType: mime
	});

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-published`;

	context.log(`Making POST request to ${requestUri}`);

	let publishedDocument;

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

	if (isGisBoundaryGeoJsonDocument(publishedDocument)) {
		context.log(`Rebuilding master GeoJson after publishing GIS boundary ${documentId}`);

		try {
			await rebuildMasterGeoJson(context.log);
		} catch (error) {
			context.log,
				error(
					`Failed to rebuild master GeoJson after publishing GIS boundary ${documentId}: ${error}`
				);
		}
	}
};
