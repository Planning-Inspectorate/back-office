import { BlobStorageClient } from '@pins/blob-storage-client';
import config from './config.js';

const blobServiceUrl =
	config.BLOB_STORAGE_ACCOUNT_HOST || config.BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN;

if (!blobServiceUrl) {
	throw new Error('No blob storage endpoint configured');
}

export const blobClient = BlobStorageClient.fromUrl(blobServiceUrl);
