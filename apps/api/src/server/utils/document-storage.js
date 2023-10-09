import config from '../config/config.js';

/**
 * @typedef {Object} DocumentInfo
 * @property {string} caseType
 * @property {string} caseReference
 * @property {string} documentName
 * @property {string} GUID
 * @property {number} [version]
 */

/**
 * @typedef {Object} WithBlobUrl
 * @property {string} blobStoreUrl
 */

/**
 * @typedef {DocumentInfo & WithBlobUrl} DocumentInfoWithBlobUrl
 */

// TODO: DJW should we not use  * @returns {Promise<import('@pins/applications.api').Api.DocumentAndBlobInfoManyResponse>}
/**
 * @param {DocumentInfo[]} documentsToSave
 * @returns {Promise<{blobStorageHost: string, privateBlobContainer: string, documents: DocumentInfoWithBlobUrl[]}>}
 */
export const getStorageLocation = async (documentsToSave) => {
	return {
		blobStorageHost: config.blobStorageUrl,
		privateBlobContainer: config.blobStorageContainer,
		documents: documentsToSave.map(populateBlobStoreUrl)
	};
};

/**
 * @param {DocumentInfo} doc
 * @returns {DocumentInfoWithBlobUrl}
 */
function populateBlobStoreUrl(doc) {
	const { caseReference, GUID, version = 1 } = doc;
	return {
		...doc,
		blobStoreUrl: `/application/${caseReference}/${GUID}/${version}`
	};
}
