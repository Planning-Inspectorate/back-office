import { requestWithApiKey } from '../common/backend-api-request.js';
import { buildPublishedFileName, parseBlobName } from './src/util.js';
import { isScannedFileHtml, isUploadedHtmlValid } from '../common/html-validation.js';
import { handleHtmlValidityFail } from './src/handle-html-validity-fail.js';
import config from '../common/config.js';
import { blobClient } from '../common/blob-client.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (
	context,
	{ caseId, documentId, version, documentURI, documentReference, filename, originalFilename }
) => {
	context.log(`Publishing document ID ${documentId} at URI ${documentURI}`);

	// replace PINs domain with primary blob domain to ensure copy operation works
	documentURI = documentURI.replace(
		config.BLOB_STORAGE_ACCOUNT_DOMAIN,
		config.BLOB_STORAGE_ACCOUNT_HOST
	);

	if (
		!caseId ||
		!documentId ||
		!version ||
		!documentURI ||
		!filename ||
		!originalFilename ||
		!documentReference
	) {
		throw Error('One or more required properties are missing.');
	}

	if (await isScannedFileHtml(documentURI)) {
		context.log('Scanned file is HTML, performing validity check');
		const isValidHtml = await isUploadedHtmlValid(documentURI, context.log);
		if (!isValidHtml) {
			await handleHtmlValidityFail(documentURI, context.log);
			throw Error(
				'Publishing failed due to HTML file failing validity check. File marked as malicious'
			);
		}
	}

	const sourceBlobName = parseBlobName(documentURI);

	if (!sourceBlobName) {
		throw Error('No blob name present in the documentURI');
	}

	const publishFileName = buildPublishedFileName({
		documentReference,
		filename,
		originalFilename
	});

	context.log(`Deploying source blob ${sourceBlobName} to destination ${publishFileName}`);

	await blobClient.copyFile({
		sourceContainerName: config.BLOB_SOURCE_CONTAINER,
		sourceBlobName,
		destinationContainerName: config.BLOB_PUBLISH_CONTAINER,
		destinationBlobName: publishFileName
	});

	const requestUri = `https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-published`;

	context.log(`Making POST request to ${requestUri}`);

	await requestWithApiKey
		.post(requestUri, {
			json: {
				publishedBlobContainer: config.BLOB_PUBLISH_CONTAINER,
				publishedBlobPath: publishFileName,
				publishedDate: new Date()
			}
		})
		.json();
};
