import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient } from '@azure/storage-blob';

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
	 * @returns {BlobStorageClient}
	 */
	static fromUrl(url) {
		const client = new BlobServiceClient(url, new DefaultAzureCredential());

		return new BlobStorageClient(client);
	}

	/**
	 * @param {string} url
	 * @param {import("@azure/storage-blob").StorageSharedKeyCredential | import("@azure/storage-blob").AnonymousCredential | import("@azure/core-auth").TokenCredential | undefined} credential
	 * @returns {BlobStorageClient}
	 */
	static fromUrlAndCredential(url, credential) {
		const client = new BlobServiceClient(url, credential);

		return new BlobStorageClient(client);
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
	 * @param {string} blobPath
	 * @returns {Promise<import('@azure/storage-blob').BlobGetPropertiesResponse>}
	 */
	getBlobProperties = (container, blobPath) => {
		const blockBlobClient = this.#getBlockBlobClient(container, blobPath);

		return blockBlobClient.getProperties();
	};

	/**
	 *
	 * @param {string} container
	 * @param {string} blobPath
	 * @returns {Promise<import('@azure/storage-blob').BlobDeleteIfExistsResponse>}
	 */
	deleteBlobIfExists(container, blobPath) {
		const blockBlobClient = this.#getBlockBlobClient(container, blobPath);

		return blockBlobClient.deleteIfExists();
	}

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
	 * @param {{sourceContainerName: string, sourceBlobName: string, destinationContainerName: string, destinationBlobName: string}} blobStorageHost
	 * @returns {Promise<import('@azure/storage-blob').CopyStatusType | undefined>}
	 */
	copyFile = async ({
		sourceContainerName,
		sourceBlobName,
		destinationContainerName,
		destinationBlobName
	}) => {
		const sourceBlob = this.#getBlockBlobClient(sourceContainerName, sourceBlobName);
		const destinationBlob = this.#getBlockBlobClient(destinationContainerName, destinationBlobName);

		const copyJob = await destinationBlob.beginCopyFromURL(sourceBlob.url);

		const result = await copyJob.pollUntilDone();

		return result.copyStatus;
	};
}
