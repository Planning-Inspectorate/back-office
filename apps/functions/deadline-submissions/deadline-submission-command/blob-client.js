import { BlobStorageClient } from '@pins/blob-storage-client';

import config from './config.js';

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
	const properties = await (async () => {
		try {
			return await client().getBlobProperties(container, blobName);
		} catch (err) {
			throw new Error(
				`getBlobProperties failed for blob ${blobName} in container ${container}: ${err}`
			);
		}
	})();

	if (!(properties?.contentType && properties.contentLength)) {
		return null;
	}

	return { contentType: properties.contentType, contentLength: properties.contentLength };
}

/**
 *
 * @param {BlobLocation} source
 * @param {BlobLocation} destination
 * @returns {Promise<boolean>}
 * */
const copyFile = async (source, destination) => {
	try {
		const result = await client().copyFile({
			sourceContainerName: source.containerName,
			sourceBlobName: source.blobName,
			destinationContainerName: destination.containerName,
			destinationBlobName: destination.blobName
		});

		return result === 'success';
	} catch (err) {
    throw new Error(`copyFile failed for source ${source} and destination ${destination}: ${err}`);
	}
};

export default { copyFile, getBlobProperties };
