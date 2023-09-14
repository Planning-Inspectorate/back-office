import { BlobStorageClient } from '@pins/blob-storage-client';
import { getEventClient, EventType } from '@pins/event-client';
import { Readable } from 'stream';
import config from './config.js';

const { storageUrl, submissionsContainer, serviceBusHost, serviceBusTopic } = config;

const ZERO_UUID = '00000000-0000-0000-0000-000000000000';

/**
 * Create a test file blob
 *
 * @returns {Promise<string>}
 * */
async function createFile() {
	const time = Date.now();
	const content = `File created for testing deadline-submissions-function at timestamp: ${time}`;
	const fileName = `test-deadline-submissions-${time}`;
	const filePath = `${ZERO_UUID}/${fileName}`;

	const stream = new Readable();
	stream.push(content);
	stream.push(null);

	const client = BlobStorageClient.fromUrl(storageUrl);
	await client.uploadStream(submissionsContainer, stream, filePath, 'text/plain');

	return fileName;
}

/**
 * Publish a deadline submission message to the relevant topic
 *
 * @param {import('@azure/functions').Context} context
 * @param {string} fileName
 * @param {string} caseReference
 * @param {string} [deadline]
 * @param {string} [submissionType]
 * @returns {Promise<void>}
 * */
async function publishMessage(
	context,
	fileName,
	caseReference,
	deadline = 'Test deadline',
	submissionType = 'Test line item'
) {
	const msg = {
		name: 'Joe Bloggs',
		email: 'fakeemail@email.com',
		caseReference,
		deadline,
		submissionType,
		blobGuid: ZERO_UUID,
		documentName: fileName
	};

	const client = getEventClient(true, context.log, serviceBusHost);

	await client.sendEvents(serviceBusTopic, [msg], EventType.Create);
}

/**
 *
 * @param {import('@azure/functions').Context} context
 * @param {import('@azure/functions').HttpRequest} req
 */
export default async function (context, req) {
	const fileName = await createFile();

	context.log(
		`created file with path '${ZERO_UUID}/${fileName}' in container '${submissionsContainer}'`
	);

	if (!req.query.case) {
		throw new Error('no `case` query parameter found');
	}

	await publishMessage(context, fileName, req.query.case, req.query.deadline, req.query.lineItem);

	context.log(`published message to topic '${serviceBusTopic}'`);
}
