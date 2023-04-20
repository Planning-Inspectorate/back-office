import got, { HTTPError } from 'got';
import { isEqual } from 'lodash-es';
import { sendDocumentStateAction } from './back-office-api-client.js';
import config from './config.js';
import { scanStream } from './scan-stream.js';

/**
 * @param {boolean} isInfected
 * @returns {string}
 */
const mapIsInfectedToMachineAction = (isInfected) => {
	return isInfected ? 'check_fail' : 'check_success';
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
 *
 * @param {Error} error
 * @returns {boolean}
 */
const errorIsDueToDocumentMissing = (error) => {
	return (
		error instanceof HTTPError &&
		error.code === 'ERR_NON_2XX_3XX_RESPONSE' &&
		error.response.statusCode === 404 &&
		isEqual(JSON.parse(error.response.body), {
			errors: { documentPath: 'Document does not exist in Blob Storage' }
		})
	);
};

/**
 * @param {string} documentUri
 * @param {import('@azure/functions').Logger} log
 */
const deleteDocument = async (documentUri, log) => {
	const documentPath = `/${documentUri.split('/').slice(-4).join('/')}`;

	try {
		await got
			.delete(`https://${config.pinsstdocsbodevukw001__blobServiceUri}/document`, {
				json: { documentPath }
			})
			.json();
	} catch (error) {
		if (errorIsDueToDocumentMissing(error)) {
			log.info('Unable to delete document from Blob Store because it is already deleted');
		} else {
			throw error;
		}
	}
};

/**
 * @param {import('@azure/functions').Logger} log
 * @param {string} blobUri
 * @param {import('node:stream').Readable} blobStream
 */
export const checkMyBlob = async (log, blobUri, blobStream) => {
	const { guid } = getBlobCaseReferenceAndGuid(blobUri);

	log.info('Sending document state is uploading to back office');
	await sendDocumentStateAction(guid, 'uploading', log);

	log.info('Scanning document for viruses');

	const isInfected = await scanStream(blobStream);

	if (isInfected) {
		log.error('Document did not pass AV checks');
		log.info('Deleting document from blob storage');
		await deleteDocument(blobUri, log);
	}

	const machineAction = mapIsInfectedToMachineAction(isInfected);

	log.info('Sending AV result to back office');
	await sendDocumentStateAction(guid, machineAction, log);
};
