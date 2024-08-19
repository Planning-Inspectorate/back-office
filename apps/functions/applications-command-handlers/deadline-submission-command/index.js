import config from './config.js';
import api from './back-office-api-client.js';
import lib from './lib.js';
import blob from './blob-client.js';
import events from './event-client.js';

/**
 * @typedef {import('pins-data-model').Schemas.NewDeadlineSubmission} NewDeadlineSubmission
 */

const { submissionsContainer } = config;

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {NewDeadlineSubmission} msg
 * @returns {Promise<string | null>}
 */
async function run(context, msg) {
	if (!msg.caseReference) {
		throw new Error('Deadline submission message does not include a `caseReference`.');
	}

	const caseID = await api.getCaseID(msg.caseReference);
	if (!caseID) {
		throw new Error(`No case found with reference: ${msg.caseReference}`);
	}

	const timetableItem = await api.getTimetableItem(caseID, msg.deadline);
	if (!timetableItem) {
		throw new Error(`Timetable item "${msg.deadline}" does not exist.`);
	}

	if (!lib.lineItemExists(timetableItem, msg.submissionType)) {
		throw new Error(
			`Line item "${msg.submissionType}" does not exist in timetable item:\n${JSON.stringify(
				timetableItem
			)}`
		);
	}

	const { nameWelsh, descriptionWelsh } = lib.getWelshDetails(timetableItem, msg.submissionType);

	const sourceBlobName = `${msg.blobGuid}/${msg.documentName}`;

	const properties = await blob.getBlobProperties(submissionsContainer, sourceBlobName);
	const folderID = await api.getFolderID(caseID, msg.deadline, msg.submissionType);

	const { privateBlobContainer, documents } = await api.submitDocument({
		caseID,
		documentName: msg.documentName,
		description: msg.submissionType,
		descriptionWelsh,
		filter1: msg.deadline,
		filter1Welsh: nameWelsh,
		documentType: properties?.contentType ?? 'application/octet-stream',
		documentSize: properties?.contentLength ?? 0,
		folderID,
		userEmail: msg.email
	});

	if (documents.length === 0) {
		throw new Error('No documents to process in response from API');
	}

	const { blobStoreUrl } = documents[0];
	const destinationName = blobStoreUrl.startsWith('/') ? blobStoreUrl.slice(1) : blobStoreUrl;

	const match = blobStoreUrl.match(/^\/application\/.+\/(.+)\/1$/);
	if (!match) {
		throw new Error(`RegEx match failed for blob store URL: ${blobStoreUrl}`);
	}

	const successful = await blob.copyFile(
		{ containerName: submissionsContainer, blobName: sourceBlobName },
		{ containerName: privateBlobContainer, blobName: destinationName }
	);

	if (!successful) {
		return null;
	}

	await api.populateDocumentMetadata(caseID, {
		documentGuid: match[1],
		documentName: msg.documentName,
		userName: msg.name,
		deadline: msg.deadline,
		submissionType: msg.submissionType,
		representative: msg.interestedPartyReference
	});

	return documents[0].blobStoreUrl;
}

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {NewDeadlineSubmission} msg
 */
export default async function (context, msg) {
	context.log('Handle new deadline submission', msg);

	try {
		const blobStoreUrl = await run(context, msg);

		context.log(
			`Successfully copied blob ${msg.blobGuid} from submissions to uploads store with name ${blobStoreUrl}`
		);
	} catch (err) {
		await events.publishFailureEvent(context, {
			deadline: msg.deadline,
			submissionType: msg.submissionType,
			blobGuid: msg.blobGuid,
			documentName: msg.documentName
		});

		context.log(`Failed to copy blob ${msg.blobGuid} from submissions to uploads store`);

		throw err;
	}
}
