import { BlobStorageClient } from '@pins/blob-storage-client';

import config from './config.js';

const { storageDomain, storageHost } = config;

/**
 *
 * @typedef {{ containerName: string, blobName: string }} BlobLocation
 * */

const client = () => BlobStorageClient.fromUrl(storageDomain);

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
			err.customErrorMessage = `getBlobProperties failed for blob ${blobName} in container ${container}: ${err}`;
			throw err;
		}
	})();

	if (!(properties?.contentType && properties.contentLength)) {
		return null;
	}

	return { contentType: properties.contentType, contentLength: properties.contentLength };
}

/**
 * @param {import('@azure/functions').Context} context
 * @param {BlobLocation} source
 * @param {BlobLocation} destination
 * @returns {Promise<boolean>}
 * */
const copyFile = async (context, source, destination) => {
	const sourceUrl = [
		storageHost.replace(/\/$/, ''),
		source.containerName,
		source.blobName.replace(/^\//, '')
	].join('/');

	try {
		context.log(`Source URL: ${sourceUrl}`);

		const result = await client().copyFileFromUrl({
			sourceUrl,
			destinationContainerName: destination.containerName,
			destinationBlobName: destination.blobName
		});

		return result === 'success';
	} catch (err) {
		context.log('Full error details:', JSON.stringify(err, null, 2));
		throw new Error(
			`copyFile failed for sourceUrl: ${sourceUrl}, source: (container: ${source.containerName}, blob: ${source.blobName}) ` +
				`and destination (container: ${destination.containerName}, blob: ${destination.blobName}): ${err}`
		);
	}
};

export default { copyFile, getBlobProperties };
