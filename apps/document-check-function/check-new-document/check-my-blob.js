import got, { HTTPError } from 'got';
import { isEqual } from 'lodash-es';
import { sendDocumentStateAction } from './back-office-api-client.js';
import { scanStream } from './scan-stream.js';

/**
 * @typedef {{bindingData: {uri: string, blobTrigger: any}, error: any, info: any, log: any}} Context
 */

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
 * @returns {{caseId: string, guid: string}}
 */
const getBlobCaseIdAndGuid = (blobUri) => {
	const uriParts = blobUri.split('/');

	if (uriParts.length !== 5 || uriParts[1] !== 'applications') {
		throw new Error(`Unexpected blob URI ${blobUri}`);
	}

	return { caseId: uriParts[2], guid: uriParts[3] };
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
 * @param {Context} context
 */
const deleteDocument = async (documentUri, context) => {
	try {
		await got
			.delete('http://localhost:3001/document', { json: { documentPath: documentUri } })
			.json();
	} catch (error) {
		if (errorIsDueToDocumentMissing(error)) {
			context.info('Unable to delete document from Blob Store because it is already deleted');
		} else {
			throw error;
		}
	}
};

/**
 * @param {Context} context
 * @param {import('node:stream').Readable} myBlob
 */
export const checkMyBlob = async (context, myBlob) => {
	const documentUri = context.bindingData.uri;
	const { caseId, guid } = getBlobCaseIdAndGuid(documentUri);

	const isInfected = await scanStream(myBlob);

	if (isInfected) {
		context.error('Document did not pass AV checks');
		await deleteDocument(documentUri, context);
	}

	const machineAction = mapIsInfectedToMachineAction(isInfected);

	await sendDocumentStateAction(guid, caseId, machineAction, context);
};
