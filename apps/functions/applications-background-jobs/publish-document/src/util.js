import config from '../../common/config.js';

/**
 *
 * @param {{reference: string, filename: string, originalFilename: string}} params
 * @returns {string}
 */
export const buildPublishedFileName = ({ reference, filename, originalFilename }) => {
	const fileExtensionRegex = /\.[0-9a-z]+$/i;
	const originalExtension = originalFilename.match(fileExtensionRegex)?.[0];
	const newExtension = filename.match(fileExtensionRegex)?.[0];

	const publishedFileName =
		originalExtension === newExtension ? filename : `${filename}${originalExtension}`;

	return `${reference}-${publishedFileName}`;
};

/**
 *
 * @param {string} uri
 * @returns {string | undefined}
 */
export const trimSlashes = (uri) => uri?.replace(/^\/+|\/+$/g, '');

/**
 *
 * @param {string} documentURI
 * @returns {string | undefined}
 */
export const parseBlobName = (documentURI) => {
	const [storageAccountHost, blobName] = documentURI.split(config.BLOB_SOURCE_CONTAINER);

	if (trimSlashes(storageAccountHost) != trimSlashes(config.BLOB_STORAGE_ACCOUNT_HOST)) {
		throw Error(`Attempting to copy from unknown storage account host ${storageAccountHost}`);
	}

	return trimSlashes(blobName);
};
