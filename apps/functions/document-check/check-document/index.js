import { Readable } from 'node:stream';
import {
	getBlobStream,
	getBlobProperties,
	parseBlobFromUrl,
	readStreamToString
} from './blob-utils.js';
import { checkMyBlob } from './check-my-blob.js';
import { handleInfected, handleNotInfected, handleInvalidHTML } from './event-client.js';
import { validateHTML } from './validate-html.js';

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
	const readableStream = new Readable().wrap(blobStream);

	const { guid, isInfected } = await checkMyBlob(context.log, url, readableStream);
	if (isInfected) {
		context.log.info('Virus detected for blob', blobPath);
		await handleInfected(context, guid);
		return;
	}

	const blobInfo = await getBlobProperties(storageUrl, container, blobPath);
	if (blobInfo.contentType !== 'text/html') {
		await handleNotInfected(context, guid);
		return;
	}

	const html = await readStreamToString(readableStream);
	try {
		validateHTML(html);
	} catch (err) {
		context.log.error(err);
		await handleInvalidHTML(context, guid);
		return;
	}

	await handleNotInfected(context, guid);

	context.log.info(
		'Successfully scanned stream for blob',
		storageUrl,
		container,
		blobPath,
		isInfected
	);
};
