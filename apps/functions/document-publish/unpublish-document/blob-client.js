import { BlobStorageClient } from '@pins/blob-storage-client';
import config from './config.js';

export const blobClient = BlobStorageClient.fromUrl(config.BLOB_STORAGE_ACCOUNT_HOST);
