import config from './config.js';
import got from 'got';
import { blobClient } from './blob-client.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (
	context,
	{ documentId, documentURI, documentReference, filename, originalFilename }
) => {
	context.log(`Publishing document ID ${documentId} at URI ${documentURI}`);

	if (!documentId || !documentURI || !filename || !originalFilename) {
		// TODO: Once we sort out documentReference, validate that too
		throw Error('One or more required properties are missing.');
	}

	const publishFileName = buildPublishedFileName({
		documentReference,
		filename,
		originalFilename
	});

	context.log(`Deploying to file name ${publishFileName}`);

	await blobClient.copyFile({
		sourceContainerName: config.BLOB_SOURCE_CONTAINER,
		sourceBlobName: documentURI,
		destinationContainerName: config.BLOB_PUBLISH_CONTAINER,
		destinationBlobName: publishFileName
	});

	await got
		.patch(`https://${config.API_HOST}/applications/documents/${documentId}/status`, {
			json: {
				machineAction: 'published'
			}
		})
		.json();
};

const fileExtensionRegex = /\.[0-9a-z]+$/i;

/**
 *
 * @param {{documentReference: string, filename: string, originalFilename: string}} params
 */
const buildPublishedFileName = ({ documentReference, filename, originalFilename }) => {
	const originalExtension = originalFilename.match(fileExtensionRegex)?.[0];
	const newExtension = filename.match(fileExtensionRegex)?.[0];

	const publishedFileName =
		originalExtension === newExtension ? filename : `${filename}${originalExtension}`;

	return `${documentReference}-${publishedFileName}`;
};
