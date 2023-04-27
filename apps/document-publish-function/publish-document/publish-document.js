import { BlobStorageClient } from '@pins/blob-storage-client';
import config from './config.js';

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {{container: string, path: string}} documentToCopy
 * @param {{container: string, path: string}} documentDestination
 */
export const publishDocument = async (context, documentToCopy, documentDestination) => {
	const blobStorageClient = BlobStorageClient.fromUrl(config.DOCUMENT_STORAGE_HOST);

	context.log.info(
		`Copying document from ${JSON.stringify(documentToCopy)} to ${JSON.stringify(
			documentDestination
		)}`
	);

	await blobStorageClient.copyFile({
		currentContainer: documentToCopy.container,
		currentFilePath: documentToCopy.path,
		desiredContainer: documentDestination.container,
		desiredFilePath: documentDestination.path
	});
};
