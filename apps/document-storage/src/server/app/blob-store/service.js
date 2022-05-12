import { BlobServiceClient } from '@azure/storage-blob';
import getStream from 'into-stream';
import md5 from 'crypto-js/md5.js';
import config from '../../config/config.js';

const connectionString = config.blobStore.connectionString;
const containerName = config.blobStore.container;

const getBlobName = (originalName) => {
	const identifier = Math.random().toString().replace(/0\./, '');
	return `${identifier}-${originalName}`;
};

const getContainerClient = function () {
	const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
	return blobServiceClient.getContainerClient(containerName);
};

const getBlockBlobClient = function(blobName) {
	return getContainerClient().getBlockBlobClient(blobName);
}

export const getListOfBlobs = async function (type, id) {
	const containerClient = getContainerClient();
	const blobs = await containerClient.listBlobFlatSegment(undefined, { prefix: `${type}/${id}` });
	return blobs;
};

export const uploadBlob = async function (
	type,
	id,
	metadata,
	blobOriginalName,
	blobContent,
	blobContentType
) {
	const blobName = getBlobName(blobOriginalName);
	const stream = getStream(blobContent);

	const md5Value = Uint8Array.from(md5(stream).toString());

	const blockBlobClient = getBlockBlobClient(`${type}/${id}/${blobName}`);
	await blockBlobClient.uploadStream(stream,
		undefined, undefined,
		{
			blobHTTPHeaders: {
				blobContentType: blobContentType,
				blobContentMD5: md5Value
			},
			metadata: metadata
		}
	);
};

export const downloadBlob = async function (blobName) {
	const blobContent = await getBlockBlobClient(blobName).downloadToBuffer();
	return blobContent
}
