import { BlobServiceClient } from '@azure/storage-blob';
import getStream from 'into-stream';
import md5 from 'crypto-js/md5.js';
import config from '../../config/config.js';

const connectionString = config.blobStore.connectionString;
const containerName = config.blobStore.container;

const getBlobName = originalName => {
    const identifier = Math.random().toString().replace(/0\./, '');
    return `${identifier}-${originalName}`;
};

export const getListOfBlobs = async function () {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    return await containerClient.listBlobFlatSegment();
}

export const uploadBlob = async function (blobOriginalName, blobContent) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
    const blobName = getBlobName(blobOriginalName);
    const stream = getStream(blobContent);

    const md5Value = Uint8Array.from(md5(stream).toString());

    const containerClient = blobServiceClient.getContainerClient(containerName);;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    await blockBlobClient.uploadStream(stream,
        undefined, undefined,
        {
            blobHTTPHeaders: {
                blobContentType: "application/json",
                blobContentMD5: md5Value
            }
        }
    );
}
