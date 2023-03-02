import { BlobStorageClient } from '@pins/blob-storage-client';
import config from './config.js';

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {{container: string, path: string}} documentToCopy
 * @param {{container: string, path: string}} documentDestination
 */
export const publishDocument = async (context, documentToCopy, documentDestination) => {
	const blobStorageClient = BlobStorageClient.fromConnectionString(
		config.DOCUMENT_STORAGE_CONNECTION_STRING
	);

	await blobStorageClient.copyFile(
		documentToCopy.container,
		documentToCopy.path,
		documentDestination.container,
		documentDestination.path
	);
};
