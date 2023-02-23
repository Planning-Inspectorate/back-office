import { BlobServiceClient } from '@azure/storage-blob';
import { Readable } from 'node:stream';

export class BlobStorageClient {
	/**
	 *
	 * @param {string} url
	 * @param {import('@azure/core-auth').AccessToken} accessToken
	 */
	constructor(url, accessToken) {
		this.url = url;
		this.accessToken = accessToken;
	}

	/**
	 *
	 * @param {string} url
	 * @param {import('@azure/core-auth').AccessToken} accessToken
	 * @returns {BlobServiceClient}
	 */
	#getBlobStorageClient = (url, accessToken) => {
		return new BlobServiceClient(url, {
			getToken: async () => accessToken
		});
	};

	/**
	 *
	 * @param {string} url
	 * @param {import('@azure/core-auth').AccessToken} accessToken
	 * @param {string} container
	 * @returns {import('@azure/storage-blob').ContainerClient}
	 */
	#getContainerClient = (url, accessToken, container) => {
		const blobStorageClient = this.#getBlobStorageClient(url, accessToken);

		return blobStorageClient.getContainerClient(container);
	};

	/**
	 *
	 * @param {string} url
	 * @param {import('@azure/core-auth').AccessToken} accessToken
	 * @param {string} container
	 * @param {string} blobPath
	 * @returns {import('@azure/storage-blob').BlockBlobClient}
	 */
	#getBlockBlobClient = (url, accessToken, container, blobPath) => {
		const containerClient = this.#getContainerClient(url, accessToken, container);

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
		const blockBlobClient = this.#getBlockBlobClient(
			this.url,
			this.accessToken,
			container,
			filePath
		);
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
		const blockBlobClient = this.#getBlockBlobClient(
			this.url,
			this.accessToken,
			container,
			filePath
		);

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
		const blockBlobClient = this.#getBlockBlobClient(
			this.url,
			this.accessToken,
			container,
			filePath
		);

		return blockBlobClient.download();
	};

	/**
	 *
	 * @param {string} currentContainer
	 * @param {string} currentFilePath
	 * @param {string} desiredContainer
	 * @param {string} desiredFilePath
	 */
	copyFile = async (currentContainer, currentFilePath, desiredContainer, desiredFilePath) => {
		const { readableStreamBody, blobType } = await this.downloadStream(
			currentContainer,
			currentFilePath
		);

		if (!readableStreamBody) {
			throw new Error(`Document ${currentFilePath} not found in container ${currentContainer}`);
		}

		await this.uploadStream(
			desiredContainer,
			Readable.from(readableStreamBody),
			desiredFilePath,
			blobType
		);
	};
}
