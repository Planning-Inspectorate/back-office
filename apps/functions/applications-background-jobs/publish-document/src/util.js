import config from '../../common/config.js';
import { ensureTrailingSlash } from '../../common/util.js';

/**
 *
 * @param {{documentReference: string, filename: string, originalFilename: string}} params
 * @returns {string}
 */
export const buildPublishedFileName = ({ documentReference, filename, originalFilename }) => {
	const fileExtensionRegex = /\.[0-9a-z]+$/i;
	const originalExtension = originalFilename.match(fileExtensionRegex)?.[0];
	const newExtension = filename.match(fileExtensionRegex)?.[0];

	const publishedFileName =
		originalExtension === newExtension ? filename : `${filename}${originalExtension}`;

	return `${documentReference}-${publishedFileName}`;
};

/**
 *
 * @param {string} [uri]
 * @returns {string | undefined}
 */
export const trimSlashes = (uri) => uri?.replace(/^\/+|\/+$/g, '');

/**
 *
 * @param {string} documentURI
 * @param {Object<string,string>} [conf]
 * @returns {undefined}
 */
export const validateStorageAccount = (documentURI, conf = config) => {
	// does the document URI start with either the custom domain or account host?
	// if not, throw an error
	if (![conf.BLOB_STORAGE_ACCOUNT_HOST, conf.BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN]
			.map(trimSlashes)
			.some(host => documentURI.startsWith(host))) {
		throw Error(`Attempting to copy from unknown storage account host ${documentURI}`);
	}
};

/**
 *
 * @param {string} documentURI
 * @returns {string}
 */
export const replaceCustomDomainWithBlobDomain = (documentURI) => {
	return documentURI.replace(
		ensureTrailingSlash(config.BLOB_STORAGE_ACCOUNT_CUSTOM_DOMAIN),
		ensureTrailingSlash(config.BLOB_STORAGE_ACCOUNT_HOST)
	);
};
