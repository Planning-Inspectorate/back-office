import config from './config.js';
import api from './back-office-api-client.js';
import lib from './lib.js';
import blob from './blob-client.js';
import events from './event-client.js';

/**
 * @typedef {import('@planning-inspectorate/data-model').Schemas.NewDeadlineSubmission} NewDeadlineSubmission
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

	//Due to a breaking change in FO to upload blob URLs, a temporary fallback is introduced to maintain compatibility without downtime.
	//primarySourceBlobName can become the main sourceBlobName after both FO and CBOS upload and copy from <guid>/1 URL
	//fallback to secondarySourceBlobName will then no longer be needed and can be removed
	const primarySourceBlobName = `${msg.blobGuid}/1`;
	const secondarySourceBlobName = `${msg.blobGuid}/${msg.documentName}`;

	let sourceBlobName = primarySourceBlobName;
	let properties;

	try {
		properties = await blob.getBlobProperties(submissionsContainer, sourceBlobName);
	} catch (error) {
		//TODO: remove the fallback to secondarySourceBlobName once FO and CBOS have been released to production
		if (error.statusCode === 404) {
			context.log(
				`Primary blob not found: ${primarySourceBlobName}. Attempting secondary: ${secondarySourceBlobName}`
			);
			sourceBlobName = secondarySourceBlobName;
			properties = await blob.getBlobProperties(submissionsContainer, sourceBlobName);
		}
	}

	if (!properties) {
		throw new Error(`Could not find properties for ${sourceBlobName}`);
	}

	context.log('Blob properties:', JSON.stringify(properties, null, 2));

	// Check if the matching folder ID exists for the timetable item
	const examItemfolderExists = await api.examTimetableItemFolderExists(
		caseID,
		timetableItem.folderId,
		msg.deadline
	);
	if (!examItemfolderExists) {
		throw new Error(
			`Exam Item folder does not exist for case ID ${caseID} and folder ID ${timetableItem.folderId}`
		);
	}

	// get the correct sub item folder ID
	let examLineItemFolderID;
	try {
		examLineItemFolderID = await api.getExamTimetableLineItemFolderID(
			caseID,
			timetableItem.folderId,
			msg.submissionType
		);
	} catch (err) {
		context.log(
			`Error getting Exam Item Sub Item folder ID for ${msg.submissionType} in Folder ${timetableItem.folderId} : ${err}`
		);
		// get the high level Unassigned folder, or create it if it doesn't exist
		examLineItemFolderID = await api.getOrCreateUnassignedFolderId(
			caseID,
			timetableItem.folderId,
			context
		);
	}

	const { privateBlobContainer, documents } = await api.submitDocument({
		caseID,
		documentName: msg.documentName,
		description: msg.submissionType,
		descriptionWelsh,
		filter1: msg.deadline,
		filter1Welsh: nameWelsh,
		documentType: properties?.contentType ?? 'application/octet-stream',
		documentSize: properties?.contentLength ?? 0,
		folderID: examLineItemFolderID,
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
		context,
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
		interestedPartyNumber: msg.interestedPartyReference
	});

	return documents[0].blobStoreUrl;
}

/**
 * Handle a Have Your Say submission on an Exam deadline, from Front Office
 *
 * @param {import('@azure/functions').Context} context	// Note that context log messages are written to the Fns Aps Invocation Logs
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
