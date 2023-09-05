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
 * @returns {Promise<void>}
 * */
async function publishMessage(context, fileName) {
	const msg = {
		name: 'Joe Bloggs',
		email: 'fakeemail@email.com',
		deadline: 'Test deadline',
		submissionType: 'Test line item',
		blobGuid: ZERO_UUID,
		documentName: fileName
	};

	const client = getEventClient(true, context.log, serviceBusHost);

	await client.sendEvents(serviceBusTopic, [msg], EventType.Create);
}

/**
 *
 * @param {import('@azure/functions').Context} context
 */
export default async function (context) {
	const fileName = await createFile();

	context.log(
		`created file with path '${ZERO_UUID}/${fileName}' in container '${submissionsContainer}'`
	);

	await publishMessage(context, fileName);

	context.log(`published message to topic '${serviceBusTopic}'`);
}
