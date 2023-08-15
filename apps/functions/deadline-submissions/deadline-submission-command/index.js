import { BlobStorageClient } from '@pins/blob-storage-client';
import { getEventClient, EventType } from '@pins/event-client';
import config from './config';
import api from './back-office-api-client';

const { storageUrl, submissionsContainer, serviceBusHost, serviceBusTopic } = config;

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

	const sourceBlobName = `${msg.blobGuid}/${msg.documentName}`;

	const properties = await client.getBlobProperties(submissionsContainer, sourceBlobName);
	const folderID = await api.getFolderID(caseID, msg.deadline, msg.submissionType);

	const { privateBlobContainer, documents } = await api.submitDocument({
		caseID,
		documentName: msg.documentName,
		documentType: properties.contentType ?? 'application/octet-stream',
		documentSize: properties.contentLength ?? 0,
		folderID,
		userEmail: msg.email
	});

	if (documents.length === 0) {
		context.log.error('No documents to process in response from API');
		return;
	}

	const result = await client.copyFile({
		sourceContainerName: submissionsContainer,
		sourceBlobName,
		destinationContainerName: privateBlobContainer,
		destinationBlobName: documents[0].blobStoreUrl
	});

	const eventClient = getEventClient(true, context.log, serviceBusHost);

	const event = {
		status: result === 'success' ? 'SUCCESS' : 'FAILURE',
		deadline: msg.deadline,
		submissionType: msg.submissionType,
		blobGuid: msg.blobGuid,
		documentName: msg.documentName
	};

	eventClient.sendEvents(
		serviceBusTopic,
		[event],
		result === 'success' ? EventType.Success : EventType.Failure
	);

	context.log(
		result === 'success'
			? `Successfully copied blob ${msg.blobGuid} from submissions to uploads store`
			: `Failed to copy blob ${msg.blobGuid} from submissions to uploads store`
	);
}
