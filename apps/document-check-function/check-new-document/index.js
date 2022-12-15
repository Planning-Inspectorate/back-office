import got from 'got';
import { sendDocumentStateAction } from './back-office-api-client.js';
import { scanStream } from './scan-stream.js';

/**
 * @param {boolean} isInfected
 * @returns {string}
 */
const mapIsInfectedToMachineAction = (isInfected) => {
	return isInfected ? 'check_fail' : 'check_pass';
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
 * @param {string} documentUri
 */
const deleteDocument = async (documentUri) => {
	await got.delete('document-storage-api/document', { json: { documentPath: documentUri } }).json();
};

/**
 * @param {{bindingData: {uri: string}, error: any}} context
 * @param {import('node:stream').Readable} myBlob
 */
export const checkMyBlob = async (context, myBlob) => {
	const documentUri = context.bindingData.uri;
	const { caseId, guid } = getBlobCaseIdAndGuid(documentUri);

	const isInfected = await scanStream(myBlob);

	if (isInfected) {
		context.error('Document did not pass AV checks');
		await deleteDocument(documentUri);
	}

	const machineAction = mapIsInfectedToMachineAction(isInfected);

	await sendDocumentStateAction(guid, caseId, machineAction);
};
