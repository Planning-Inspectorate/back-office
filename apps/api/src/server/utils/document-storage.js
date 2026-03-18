import config from '../config/config.js';

/**
 * @typedef {import('@pins/applications.api').Api.DocumentAndBlobStorageDetail} DocumentAndBlobStorageDetail
 * @typedef {import('@pins/applications.api').Api.DocumentBlobStoragePayload} DocumentBlobStoragePayload
 */

/**
 * @param {DocumentBlobStoragePayload[]} documentsToSave
 * @param {boolean} isFromDcoPortal
 * @returns {Promise<import('@pins/applications.api').Api.DocumentAndBlobInfoManyResponse>}
 */
export const getStorageLocation = async (documentsToSave, isFromDcoPortal) => {
	return {
		blobStorageHost: config.blobStorageUrl,
		privateBlobContainer: config.blobStorageContainer,
		documents: isFromDcoPortal
			? documentsToSave.map(populateDcoBlobStoreUrl)
			: documentsToSave.map(populateDefaultBlobStoreUrl)
	};
};

/**
 * @param {DocumentBlobStoragePayload} doc
 * @returns {DocumentAndBlobStorageDetail}
 */
function populateDefaultBlobStoreUrl(doc) {
	const { caseReference, GUID, version = 1 } = doc;
	return {
		...doc,
		blobStoreUrl: `/application/${caseReference}/${GUID}/${version}`
	};
}

function populateDcoBlobStoreUrl(doc) {
	const { blobStoreUrl } = doc;
	return {
		...doc,
		//For DCO portal submissions, the URL is already provided and does not need to be created, so we just pass it through
		blobStoreUrl
	};
}
