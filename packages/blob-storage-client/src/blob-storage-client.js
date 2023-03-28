import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'node:stream';

export class BlobStorageClient {
	/**
	 * @param {BlobServiceClient} client
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 *
	 * @param {string} url
	 * @param {import('@azure/core-auth').AccessToken} accessToken
	 * @returns {BlobStorageClient}
	 */
	static fromUrlAndToken(url, accessToken) {
		const client = new BlobServiceClient(url, {
			getToken: async () => accessToken
		});

		return new BlobStorageClient(client);
	}

	/**
	 * @param {string} connectionString
	 * @returns {BlobStorageClient}
	 */
	static fromConnectionString(connectionString) {
		const client = BlobServiceClient.fromConnectionString(connectionString);

		return new BlobStorageClient(client);
	}

	/**
	 * @param {string} container
	 * @returns {import('@azure/storage-blob').ContainerClient}
	 */
	#getContainerClient = (container) => {
		return this.client.getContainerClient(container);
	};

	/**
	 *
	 * @param {string} container
	 * @param {string} blobPath
	 * @returns {import('@azure/storage-blob').BlockBlobClient}
	 */
	#getBlockBlobClient = (container, blobPath) => {
		const containerClient = this.#getContainerClient(container);

		return containerClient.getBlockBlobClient(blobPath);
	};

	/**
	 *
	 * @param {string} fileType
	 * @returns {import('@azure/storage-blob').BlockBlobUploadStreamOptions}
	 */
	#getFileUploadOptions = (fileType) => {
		return { blobHTTPHeaders: { blobContentType: fileType } };
	};

	/**
	 *
	 * @param {string} container
	 * @param {File} fileContent
	 * @param {string} filePath
	 * @param {string} fileType
	 */
	uploadFile = async (container, fileContent, filePath, fileType) => {
		const blockBlobClient = this.#getBlockBlobClient(container, filePath);
		const options = this.#getFileUploadOptions(fileType);

		await blockBlobClient.uploadData(fileContent, options);
	};

	/**
	 *
	 * @param {string} container
	 * @param {import('node:stream').Readable} fileStream
	 * @param {string} filePath
	 * @param {string | undefined} fileType
	 */
	uploadStream = async (container, fileStream, filePath, fileType) => {
		const blockBlobClient = this.#getBlockBlobClient(container, filePath);

		let bufferSize;
		let maxConcurrency;
		let defaultOptions;

		const options = fileType ? this.#getFileUploadOptions(fileType) : defaultOptions;

		await blockBlobClient.uploadStream(fileStream, bufferSize, maxConcurrency, options);
	};

	/**
	 *
	 * @param {string} container
	 * @param {string} filePath
	 * @returns {Promise<import('@azure/storage-blob').BlobDownloadResponseParsed>}
	 */
	downloadStream = async (container, filePath) => {
		const blockBlobClient = this.#getBlockBlobClient(container, filePath);

		return blockBlobClient.download();
	};

	/**
	 *
	 * @param {{context: any, currentContainer: string, currentFilePath: string, desiredContainer: string, desiredFilePath: string}} blobStorageHost
	 */
	copyFile = async ({
		context,
		currentContainer,
		currentFilePath,
		desiredContainer,
		desiredFilePath
	}) => {
		context.log.info('Copying files');

		const currentBlockBlobClient = this.#getBlockBlobClient(currentContainer, currentFilePath);

		context.log.info('Got blob clients');

		context.log.info(currentBlockBlobClient);
		context.log.info(currentBlockBlobClient.url);

		const file = await currentBlockBlobClient.download();
		const fileStream = file.readableStreamBody;

		context.log.info('Got file stream');

		if (typeof fileStream === 'undefined') {
			throw new TypeError('File Empty');
		}

		context.log.into('Uploading...');

		const desiredBlockBlobClient = this.#getBlockBlobClient(desiredContainer, desiredFilePath);

		await desiredBlockBlobClient.uploadStream(Readable.from(fileStream));

		context.log.info('Uploaded');
	};
}
