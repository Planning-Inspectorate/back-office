import { BlobStorageClient } from '@pins/blob-storage-client';
import { getEventClient, EventType } from '@pins/event-client';
import { Readable } from 'stream';
import joi from 'joi';

const ZERO_UUID = '00000000-0000-0000-0000-000000000000';

const context = {
	logger: {
		log: console.log,
		info: console.info,
		error: console.error
	}
};

const config = (() => {
	const schema = joi.object({
		connectionString: joi.string().required(),
		containerName: joi.string().required(),
		serviceBusHost: joi.string().required(),
		serviceBusTopic: joi.string().required()
	});

	const { value, error } = schema.validate({
		connectionString: process.env.BLOB_STORE_CONNECTION_STRING,
		containerName: process.env.BLOB_STORE_CONTAINER_NAME,
		serviceBusHost: process.env.SERVICE_BUS_HOST,
		serviceBusTopic: process.env.SERVICE_BUS_TOPIC
	});

	if (error) {
		throw error;
	}

	return value;
})();

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

	const client = BlobStorageClient.fromConnectionString(config.connectionString);
	await client.uploadStream(config.containerName, stream, filePath, 'text/plain');

	context.logger.info(
		`created file with path '${filePath}' in container '${config.containerName}'`
	);

	return fileName;
}

/**
 * Publish a deadline submission message to the relevant topic
 *
 * @param {string} fileName
 * @returns {Promise<void>}
 * */
async function publishMessage(fileName) {
	const msg = {
		name: 'Joe Bloggs',
		email: 'fakeemail@email.com',
		deadline: 'Test deadline',
		submissionType: 'Test line item',
		blobGuid: ZERO_UUID,
		documentName: fileName
	};

	const client = getEventClient(true, context.logger, config.serviceBusHost);

	context.logger.info(`published message to topic '${config.serviceBusTopic}'`);

	await client.sendEvents(config.serviceBusTopic, [msg], EventType.Create);
}

const fileName = await createFile();
await publishMessage(fileName);
