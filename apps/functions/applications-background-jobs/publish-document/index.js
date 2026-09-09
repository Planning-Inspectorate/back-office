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
		const errMsg = `One or more required properties are missing for document ID ${documentId}, caseId ${caseId}, version ${version}.`;
		context.log.error(errMsg);
		throw Error(errMsg);
	}

	if (await isScannedFileHtml(documentURI)) {
		context.log('Scanned file is HTML, performing validity check');
		const isValidHtml = await isUploadedHtmlValid(documentURI, context.log);
		if (!isValidHtml) {
			await handleHtmlValidityFail(documentURI, context.log);
			const errMsg = `Publishing failed for caseId ${caseId} due to HTML file failing validity check. File marked as malicious`;
			context.log.error(errMsg);
			throw Error(errMsg);
		}
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
	} catch (err) {
		// capture whatever the SDK managed to populate before failing - its own error
		// deserialisation can itself throw and discard the real status code/body
		const errMsg = `encountered error while copying blob for document ID ${documentId}, caseId ${caseId}: ${
			err.name ?? ''
		} ${err.message ?? err} (statusCode=${err.statusCode ?? 'unknown'}, code=${
			err.code ?? 'unknown'
		})`;
		context.log.error(errMsg);
		throw new Error(errMsg);
	}

	if (copyStatus !== 'success') {
		const errMsg = `blob copy did not succeed for document ID ${documentId}, caseId ${caseId}: copyStatus was "${copyStatus}"`;
		context.log.error(errMsg);
		throw new Error(errMsg);
	}

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-published`;

	context.log(`Making POST request to ${requestUri}`);

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
	} catch (err) {
		const errMsg = `encountered error while calling mark-as-published for document ID ${documentId}, caseId ${caseId}: ${err}`;
		context.log.error(errMsg);
		throw new Error(errMsg);
	}

	if (isGisBoundaryGeoJsonDocument(publishedDocument)) {
		context.log(`Rebuilding master GeoJson after publishing GIS boundary ${documentId}`);

		try {
			await rebuildMasterGeoJson(context.log);
		} catch (error) {
			context.log.error(
				`Failed to rebuild master GeoJson after publishing GIS boundary ${documentId}: ${error}`
			);
		}
	}
};
