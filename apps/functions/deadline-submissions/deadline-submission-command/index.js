import { BlobStorageClient } from '@pins/blob-storage-client';
import config from './config';
import api from './back-office-api-client';

const { storageUrl, submissionsContainer, uploadsContainer } = config;

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

	const client = BlobStorageClient.fromUrl(storageUrl);

	const destinationBlobName = `${msg.deadline}/${msg.submissionType}/${msg.blobGuid}/${msg.documentName}`;

	const result = await client.copyFile({
		sourceContainerName: submissionsContainer,
		sourceBlobName: `${msg.blobGuid}/${msg.documentName}`,
		destinationContainerName: uploadsContainer,
		destinationBlobName
	});

	if (result !== 'success') {
		// TODO: Publish failure message to service bus
		context.log('Copying blob failed', result);
	}

	const properties = await client.getBlobProperties(uploadsContainer, destinationBlobName);

	const folderID = await api.getFolderID(caseID, msg.deadline, msg.submissionType);

	await api.submitDocument({
		caseID,
		documentName: msg.documentName,
		documentType: properties.contentType ?? 'application/octet-stream',
		documentSize: properties.contentLength ?? 0,
		folderID,
		userEmail: msg.email
	});

	context.log('Copied blob', result);
}
