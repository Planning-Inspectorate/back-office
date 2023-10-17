import config from './config.js';

/**
 *
 * @param {string} documentURI
 * @returns {string | undefined}
 */
export const parseBlobName = (documentURI) => {
	const [storageAccountHost, blobName] = documentURI.split(config.BLOB_SOURCE_CONTAINER);

	if (trimSlashes(storageAccountHost) != trimSlashes(config.BLOB_STORAGE_ACCOUNT_HOST)) {
		throw new Error(`Attempting to copy from unknown storage account host ${storageAccountHost}`);
	}

	return trimSlashes(blobName);
};

/**
 *
 * @param {string} uri
 * @returns {string | undefined}
 */
const trimSlashes = (uri) => uri?.replace(/^\/+|\/+$/g, '');
