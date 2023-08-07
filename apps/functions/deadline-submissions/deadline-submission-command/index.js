import { BlobServiceClient } from '@azure/storage-blob';
import config from './config';
import { getCaseID, getFolderID, submitDocument } from './back-office-api-client';

const { submissionsBlobStore, uploadsBlobStore } = config.blobStore;

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('@pins/api/src/message-schemas/commands/new-deadline-submission').DeadlineSubmission} msg
 */
export default async function (context, msg) {
	context.log('Handle new deadline submission', msg);

	const client = BlobServiceClient.fromConnectionString(submissionsBlobStore.connectionString);

	const sourceContainer = client.getContainerClient(submissionsBlobStore.container);
	const destContainer = client.getContainerClient(uploadsBlobStore.container);

	const sourceBlob = sourceContainer.getBlobClient(`${msg.blobGuid}/${msg.documentName}`);
	const destBlob = destContainer.getBlobClient(
		`${msg.deadline}/${msg.submissionType}/${msg.blobGuid}/${msg.documentName}`
	);

	const response = await destBlob.beginCopyFromURL(sourceBlob.url);
	const result = await response.pollUntilDone();
	if (result.copyStatus !== 'success') {
		// TODO: Publish failure message to service bus
		context.log('Copying blob failed', result);
	}

	const properties = await destBlob.getProperties();

	const caseID = await getCaseID(msg.caseReference);
	const folderID = await getFolderID(caseID, msg.deadline, msg.submissionType);

	await submitDocument({
		caseID,
		documentName: msg.documentName,
		documentType: properties.contentType ?? 'application/octet-stream',
		documentSize: properties.contentLength ?? 0,
		folderID,
		userEmail: msg.email
	});

	context.log('Copied blob', result);
}
