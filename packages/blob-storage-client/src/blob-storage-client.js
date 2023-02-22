import { BlobServiceClient } from '@azure/storage-blob';

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
		const options = { blobHTTPHeaders: { blobContentType: fileType } };

		await blockBlobClient.uploadData(fileContent, options);
	};
}
