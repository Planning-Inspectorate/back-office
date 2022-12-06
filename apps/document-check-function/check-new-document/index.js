import { sendDocumentStateAction } from './back-office-api-client.js';
import { scanStream } from './clam-av-client.js';

/**
 * @param {boolean} isInfected
 * @returns {string}
 */
const mapIsInfectedToMachineAction = (isInfected) => {
	return isInfected ? 'check_fail' : 'check_pass';
};

/**
 * @param {string} blobUri
 * @returns {{caseId: string, guid: string}}
 */
const getBlobCaseIdAndGuid = (blobUri) => {
	const uriParts = blobUri.split('/');

	return { caseId: uriParts[1], guid: uriParts[2] };
};

/**
 * @param {{bindingData: {uri: string}}} context
 * @param {import('node:stream').Readable} myBlob
 */
export const checkMyBlob = async (context, myBlob) => {
	const isInfected = await scanStream(myBlob);
	const machineAction = mapIsInfectedToMachineAction(isInfected);
	const { caseId, guid } = getBlobCaseIdAndGuid(context.bindingData.uri);

	await sendDocumentStateAction(guid, caseId, machineAction);
};
