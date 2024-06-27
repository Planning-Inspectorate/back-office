import { BlobStorageClient } from '@pins/blob-storage-client';
import { loadApiConfig } from '../common/config.js';

const config = loadApiConfig();
export const blobClient = BlobStorageClient.fromUrl(config.blobStorageAccountDomain ?? '');
