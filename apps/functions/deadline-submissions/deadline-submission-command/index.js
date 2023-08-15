import config from './config';
import api from './back-office-api-client';
import blob from './blob-client';
import events from './event-client';

const { submissionsContainer } = config;

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('@pins/api/src/message-schemas/commands/new-deadline-submission').DeadlineSubmission} msg
 */
export default async function (context, msg) {
	context.log('Handle new deadline submission', msg);

	const caseID = await api.getCaseID(msg.caseReference);
	if (!caseID) {
		// TODO: Publish failure message to service bus
		context.log.error(`No case found with reference: ${msg.caseReference}`);
		return;
	}

	const entitiesExist = await api.lineItemExists(caseID, msg.deadline, msg.submissionType);
	if (!entitiesExist) {
		context.log.error(
			`Timetable item "${msg.deadline}" or line item "${msg.msg.submissionType}" could not be found`
		);
		return;
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
		context.log.error('No documents to process in response from API');
		return;
	}

	const successful = await blob.copyFile(
		{ containerName: submissionsContainer, blobName: sourceBlobName },
		{ containerName: privateBlobContainer, blobName: documents[0].blobStoreUrl }
	);

	if (!successful) {
		await events.sendEvent(context, {
			deadline: msg.deadline,
			submissionType: msg.submissionType,
			blobGuid: msg.blobGuid,
			documentName: msg.documentName
		});
	}

	context.log(
		successful
			? `Successfully copied blob ${msg.blobGuid} from submissions to uploads store`
			: `Failed to copy blob ${msg.blobGuid} from submissions to uploads store`
	);
}
