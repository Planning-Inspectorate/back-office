import { BlobStorageClient } from '@pins/blob-storage-client';
import config from './config.js';

const storageClient = BlobStorageClient.fromUrl(config.BO_BLOB_STORAGE_ACCOUNT);

/**
 *
 * @param {string} sourceUrl
 * @param {string} destinationUrl
 */
export const copyBlob = async (sourceUrl, destinationUrl) => {
	const blobClient = storageClient.getBlobClient(config.BO_BLOB_CONTAINER, destinationUrl);
	await blobClient.syncCopyFromURL(sourceUrl);
};
