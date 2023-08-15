import { BlobStorageClient } from '@pins/blob-storage-client';

import config from './config';

const { storageUrl } = config;

/**
 *
 * @typedef {{ containerName: string, blobName: string }} BlobLocation
 * */

const client = () => BlobStorageClient.fromUrl(storageUrl);

/**
 *
 * @param {string} container
 * @param {string} blobName
 * @returns {Promise<{ contentType: string, contentLength: number } | null>}
 * */
async function getBlobProperties(container, blobName) {
	const properties = await client().getBlobProperties(container, blobName);
	if (!(properties?.contentType && properties.contentLength)) {
		return null;
	}

	return { contentType: properties.contentType, contentLength: properties.contentLength };
}

/**
 *
 * @param {BlobLocation} _
 * @param {BlobLocation} _
 * @returns {Promise<boolean>}
 * */
const copyFile = async (
	{ containerName: sourceContainer, blobName: sourceBlob },
	{ containerName: destinationContainer, blobName: destinationBlob }
) => {
	const result = await client().copyFile({
		sourceContainerName: sourceContainer,
		sourceBlobName: sourceBlob,
		destinationContainerName: destinationContainer,
		destinationBlobName: destinationBlob
	});

	return result === 'success';
};

export default { copyFile, getBlobProperties };
