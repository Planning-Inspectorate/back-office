import got, { HTTPError } from 'got';
import { isEqual } from 'lodash-es';
import { Readable } from 'node:stream';
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
 * @param {import('@azure/functions').Context} context
 */
const deleteDocument = async (documentUri, context) => {
	const documentPath = `/${documentUri.split('/').slice(-4).join('/')}`;

	try {
		await got
			.delete(`https://${config.pinsstdocsbodevukw001__blobServiceUri}/document`, {
				json: { documentPath }
			})
			.json();
	} catch (error) {
		if (errorIsDueToDocumentMissing(error)) {
			context.log.info('Unable to delete document from Blob Store because it is already deleted');
		} else {
			throw error;
		}
	}
};

/**
 * @param {import('@azure/functions').Context} context
 * @param {import('node:stream').Readable} myBlob
 */
export const checkMyBlob = async (context, myBlob) => {
	const documentUri = context.bindingData.uri;
	const { guid } = getBlobCaseReferenceAndGuid(documentUri);

	context.log('Sending document state is uploading to back office');
	await sendDocumentStateAction(guid, 'uploading', context);

	const blobStream = Readable.from(myBlob);

	context.log('Scanning document for viruses');

	const isInfected = await scanStream(blobStream);

	if (isInfected) {
		context.log.error('Document did not pass AV checks');
		context.log('Deleting document from blob storage');
		await deleteDocument(documentUri, context);
	}

	const machineAction = mapIsInfectedToMachineAction(isInfected);

	context.log('Sending AV result to back office');
	await sendDocumentStateAction(guid, machineAction, context);
};
