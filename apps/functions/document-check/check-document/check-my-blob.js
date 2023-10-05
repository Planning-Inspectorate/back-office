import { sendDocumentStateAction } from './back-office-api-client.js';
import { scanStream } from './scan-stream.js';
import { deleteBlob, parseBlobFromUrl } from './blob-utils.js';

/**
 * @param {boolean} isInfected
 * @returns {string}
 */
const mapIsInfectedToMachineAction = (isInfected) => {
	return isInfected ? 'failed_virus_check' : 'not_checked';
};

/**
 * TODO: At the minute, we get the blob case ID and GUID from the path.
 * Once we save the same info to the Blob Metadata, let's get it from there
 *
 * @param {string} blobUri
 * @returns {{guid: string}}
 */
const getBlobCaseReferenceAndGuid = (blobUri) => {
	const uriParts = blobUri.split('/');

	if (uriParts.length !== 8 || uriParts[4] !== 'application') {
		throw new Error(`Unexpected blob URI ${blobUri}`);
	}

	return { guid: uriParts[6] };
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} blobUri
 * @param {import('node:stream').Readable} blobStream
 * @returns {Promise<{ guid: string, isInfected: boolean }>}
 */
export const checkMyBlob = async (log, blobUri, blobStream) => {
	const { guid } = getBlobCaseReferenceAndGuid(blobUri);

	log.info('Sending document state is awaiting_virus_check to back office');
	await sendDocumentStateAction(guid, 'awaiting_virus_check', log);

	log.info('Scanning document for viruses');

	const isInfected = await scanStream(blobStream);

	if (isInfected) {
		log.error('Document did not pass AV checks');
		log.info('Deleting document from blob storage');

		const blobDetails = parseBlobFromUrl(blobUri);
		if (!blobDetails) {
			log.error(`Unable to parse storage details for url `, blobUri);
			throw new Error(`unexpected blob URI format, unable to parse: ${blobUri}`);
		}
		const { storageUrl, container, blobPath } = blobDetails;
		// todo: should the document be deleted?
		await deleteBlob(storageUrl, container, blobPath);
	}

	const machineAction = mapIsInfectedToMachineAction(isInfected);

	log.info('Sending AV result to back office');
	await sendDocumentStateAction(guid, machineAction, log);

	return { guid, isInfected };
};
