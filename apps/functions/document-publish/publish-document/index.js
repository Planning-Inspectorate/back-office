import config from './config.js';
import got from 'got';
import { blobClient } from './blob-client.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (
	context,
	{ caseId, documentId, version, documentURI, documentReference, filename, originalFilename }
) => {
	context.log(`Publishing document ID ${documentId} at URI ${documentURI}`);

	if (!caseId || !documentId || !version || !documentURI || !filename || !originalFilename) {
		// TODO: Once we sort out documentReference, validate that too
		throw Error('One or more required properties are missing.');
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

	context.log(`Deploying to file name ${publishFileName}`);

	await blobClient.copyFile({
		sourceContainerName: config.BLOB_SOURCE_CONTAINER,
		sourceBlobName,
		destinationContainerName: config.BLOB_PUBLISH_CONTAINER,
		destinationBlobName: publishFileName
	});

	await got
		.patch(
			`https://${config.API_HOST}/applications/${caseId}/documents/${documentId}/version/${version}/mark-as-published`,
			{
				json: {
					publishedBlobContainer: config.BLOB_PUBLISH_CONTAINER,
					publishedBlobPath: publishFileName,
					publishedDate: new Date()
				}
			}
		)
		.json();
};

/**
 *
 * @param {string} documentURI
 * @returns {string | undefined}
 */
const parseBlobName = (documentURI) => {
	const [storageAccountHost, blobName] = documentURI.split(config.BLOB_SOURCE_CONTAINER);

	if (trimSlashes(storageAccountHost) != trimSlashes(config.BLOB_STORAGE_ACCOUNT_HOST)) {
		throw Error(`Attempting to copy from unknown storage account host ${storageAccountHost}`);
	}

	return trimSlashes(blobName);
};

const fileExtensionRegex = /\.[0-9a-z]+$/i;

/**
 *
 * @param {{documentReference: string, filename: string, originalFilename: string}} params
 * @returns {string}
 */
const buildPublishedFileName = ({ documentReference, filename, originalFilename }) => {
	const originalExtension = originalFilename.match(fileExtensionRegex)?.[0];
	const newExtension = filename.match(fileExtensionRegex)?.[0];

	const publishedFileName =
		originalExtension === newExtension ? filename : `${filename}${originalExtension}`;

	return `${documentReference}-${publishedFileName}`;
};

/**
 *
 * @param {string} uri
 * @returns {string | undefined}
 */
const trimSlashes = (uri) => uri?.replace(/^\/+|\/+$/g, '');
