import { DefaultAzureCredential } from '@azure/identity';
import { BlobStorageClient } from '@pins/blob-storage-client';
import { Readable } from 'node:stream';

const blobUrlRegex = /^(https:\/\/[\w-]+\.blob\.core\.windows\.net)\/([\w-]+)\/(.+)$/;

/**
 * @param {string} url
 * @returns {{ storageUrl: string, container: string, blobPath: string } | undefined}
 */
export const parseBlobFromUrl = (/** @type {string} */ url) => {
	const urlParts = url?.match(blobUrlRegex);

	if (!urlParts || urlParts.length !== 4) {
		return;
	}

	return { storageUrl: urlParts[1], container: urlParts[2], blobPath: urlParts[3] };
};

/**
 *
 * @param {string} storageUrl
 * @param {string} container
 * @param {string} blobPath
 * @returns {Promise<import('node:stream').Readable>}
 */
export const getBlobStream = async (storageUrl, container, blobPath) => {
	const client = BlobStorageClient.fromUrlAndCredential(storageUrl, new DefaultAzureCredential());

	const response = await client.downloadStream(container, blobPath);

	if (!response.readableStreamBody) {
		throw new Error(
			`No readable stream body found for blob ${storageUrl}, ${container}, ${blobPath}`
		);
	}

	// https://stackoverflow.com/a/72188690
	return new Readable().wrap(response.readableStreamBody);
};

/**
 *
 * @param {string} storageUrl
 * @param {string} container
 * @param {string} blobPath
 * @returns {Promise<void>}
 */
export const deleteBlob = async (storageUrl, container, blobPath) => {
	const client = BlobStorageClient.fromUrlAndCredential(storageUrl, new DefaultAzureCredential());

	await client.deleteBlobIfExists(container, blobPath);
};
