import { BlobStorageClient } from '@pins/blob-storage-client';
import { getEventClient } from '@pins/event-client';
import config from './config.js';

/**
 *
 * @param {object} event
 * @param {import('@azure/functions').Context} context
 */
const sendEvent = async (event, context) => {
	const eventClient = getEventClient(
		config.NODE_ENV !== 'test',
		context.log,
		config.SERVICE_BUS_HOSTNAME
	);

	await eventClient.sendEvents(config.NSIP_DOC_TOPIC_NAME, [event], 'Publish');
};

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

	await sendEvent({ documentToCopy, documentDestination }, context);
};
