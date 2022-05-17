import { BlobServiceClient, BlockBlobClient,ContainerClient } from '@azure/storage-blob';
import md5 from 'crypto-js/md5.js';
import getStream from 'into-stream';
import config from '../../config/config.js';

const {connectionString, container} = config.blobStore;

/**
 *
 * @param {string} originalName
 * @returns {string}
 */
function getBlobName(originalName) {
	const identifier = Math.random().toString().replace(/0\./, '');

	return `${identifier}-${originalName}`;
}

/**
 * @returns {ContainerClient}
 */
function getContainerClient() {
	const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

	return blobServiceClient.getContainerClient(container);
}

/**
 *
 * @param {string} blobName
 * @returns {BlockBlobClient}
 */
function getBlockBlobClient(blobName) {
	return getContainerClient().getBlockBlobClient(blobName);
}

/**
 *
 * @param {string} type
 * @param {number} id
 */
export async function getListOfBlobs(type, id) {
	const containerClient = getContainerClient();

	let marker;

	const blobs = await containerClient.listBlobFlatSegment(undefined, { prefix: `${type}/${id}`, version: '2021-06-08' });

	return blobs;
}

/**
 *
 * @param {object} association
 * @param {string} association.type
 * @param {number} association.id
 * @param {object} metadata
 * @param {object} blob
 * @param {string} blob.originalName
 * @param {*} blob.content
 * @param {string} blob.contentType
 */

// {Buffer | NodeJS.TypedArray | ArrayBuffer | string | Iterable<Buffer | string> | undefined}

export async function uploadBlob(
	association,
	metadata,
	blob
) {
	const blobName = getBlobName(blob.originalName);
	const stream = getStream(blob.content);

	const md5Value = Uint8Array.from(md5(stream).toString());

	const blockBlobClient = getBlockBlobClient(`${association.type}/${association.id}/${blobName}`);

	let bufferSize;
	let maxConcurrency;

	await blockBlobClient.uploadStream(stream, bufferSize, maxConcurrency,
		{
			blobHTTPHeaders: {
				blobContentType: blob.contentType,
				blobContentMD5: md5Value
			},
			metadata
		}
	);
}

/**
 *
 * @param {string} blobName
 */
export async function downloadBlob(blobName) {
	const blobContent = await getBlockBlobClient(blobName).downloadToBuffer();

	return blobContent
}
