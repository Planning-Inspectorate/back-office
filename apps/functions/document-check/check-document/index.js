import { Readable } from 'node:stream';
import { getBlobStream, parseBlobFromUrl } from './blob-utils.js';
import { checkMyBlob } from './check-my-blob.js';
import { handleInfected, handleNotInfected } from './event-client.js';

/**
 * @type {import('@azure/functions').AzureFunction}
 */
export const index = async (context, eventGridEvent) => {
	if (!eventGridEvent?.data) {
		context.log.error('No input provided');
		return;
	}

	const { url, contentLength } = eventGridEvent.data;

	const blobDetails = parseBlobFromUrl(url);

	if (!blobDetails) {
		context.log.error(`Unable to parse storage details for url `, url);
		throw new Error(`unexpected blob URI format, unable to parse: ${url}`);
	}

	const { storageUrl, container, blobPath } = blobDetails;

	context.log.info(
		'JavaScript blob trigger function processed blob \n Blob:',
		storageUrl,
		container,
		blobPath,
		'\n Blob Size:',
		contentLength,
		'Bytes'
	);

	const blobStream = await getBlobStream(storageUrl, container, blobPath);

	const { guid, isInfected } = await checkMyBlob(context.log, url, new Readable().wrap(blobStream));
	if (isInfected) {
		context.log.info('Virus detected for blob', blobPath);
		await handleInfected(context, guid);
	} else {
		await handleNotInfected(context, guid);
	}

	context.log.info(
		'Successfully scanned stream for blob',
		storageUrl,
		container,
		blobPath,
		isInfected
	);
};
