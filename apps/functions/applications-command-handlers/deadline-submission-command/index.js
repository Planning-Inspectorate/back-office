import config from './config.js';
import api from './back-office-api-client.js';
import blob from './blob-client.js';
import events from './event-client.js';

const { submissionsContainer } = config;

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('@pins/api/src/message-schemas/commands/new-deadline-submission').DeadlineSubmission} msg
 * @returns {Promise<string | null>}
 */
async function run(context, msg) {
	const caseID = await api.getCaseID(msg.caseReference);
	if (!caseID) {
		throw new Error(`No case found with reference: ${msg.caseReference}`);
	}

	const entitiesExist = await api.lineItemExists(caseID, msg.deadline, msg.submissionType);
	if (!entitiesExist) {
		throw new Error(
			`Timetable item "${msg.deadline}" or line item "${msg.submissionType}" could not be found`
		);
	}

	const sourceBlobName = `${msg.blobGuid}/${msg.documentName}`;

	const properties = await blob.getBlobProperties(submissionsContainer, sourceBlobName);
	const folderID = await api.getFolderID(caseID, msg.deadline, msg.submissionType);

	const { privateBlobContainer, documents } = await api.submitDocument({
		caseID,
		documentName: msg.documentName,
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
 * @param {import('@pins/api/src/message-schemas/commands/new-deadline-submission').DeadlineSubmission} msg
 */
export default async function (context, msg) {
	context.log('Handle new deadline submission', msg);

	let blobStoreUrl = null;
	try {
		blobStoreUrl = await run(context, msg);
	} catch (err) {
		context.log(err);

		await events.publishFailureEvent(context, {
			deadline: msg.deadline,
			submissionType: msg.submissionType,
			blobGuid: msg.blobGuid,
			documentName: msg.documentName
		});
	}

	context.log(
		blobStoreUrl
			? `Successfully copied blob ${msg.blobGuid} from submissions to uploads store with name ${blobStoreUrl}`
			: `Failed to copy blob ${msg.blobGuid} from submissions to uploads store`
	);
}
