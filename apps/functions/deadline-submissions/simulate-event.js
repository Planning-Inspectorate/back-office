import { BlobStorageClient } from '@pins/blob-storage-client';
import { Readable } from 'stream';
import joi from 'joi';

const ZERO_UUID = '00000000-0000-0000-0000-000000000000';

const config = (() => {
	const schema = joi.object({
		connectionString: joi.string().required(),
		containerName: joi.string().required()
	});

	const { value, error } = schema.validate({
		connectionString: process.env.BLOB_STORE_CONNECTION_STRING,
		containerName: process.env.BLOB_STORE_CONTAINER_NAME
	});

	if (error) {
		throw error;
	}

	return value;
})();

async function createFile() {
	const time = Date.now();
	const content = `File created for testing deadline-submissions-function at timestamp: ${time}`;
	const filePath = `${ZERO_UUID}/test-deadline-submissions-${time}`;

	const stream = new Readable();
	stream.push(content);
	stream.push(null);

	const client = BlobStorageClient.fromConnectionString(config.connectionString);
	await client.uploadStream(config.containerName, stream, filePath, 'text/plain');

	return filePath;
}

createFile();
