import config from '../config/config.js';

/**
 * @typedef {import('@pins/applications.api').Api.DocumentAndBlobStorageDetail} DocumentAndBlobStorageDetail
 * @typedef {import('@pins/applications.api').Api.DocumentBlobStoragePayload} DocumentBlobStoragePayload
 */

/**
 * @param {DocumentBlobStoragePayload[]} documentsToSave
 * @returns {Promise<import('@pins/applications.api').Api.DocumentAndBlobInfoManyResponse>}
 */
export const getStorageLocation = async (documentsToSave) => {
	return {
		blobStorageHost: config.blobStorageUrl,
		privateBlobContainer: config.blobStorageContainer,
		documents: documentsToSave.map(populateBlobStoreUrl)
	};
};

/**
 * @param {DocumentBlobStoragePayload} doc
 * @returns {DocumentAndBlobStorageDetail}
 */
function populateBlobStoreUrl(doc) {
	const { caseReference, GUID, version = 1 } = doc;
	return {
		...doc,
		blobStoreUrl: `/application/${caseReference}/${GUID}/${version}`
	};
}
