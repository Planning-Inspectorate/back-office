import got from 'got';
import config from '../config/config.js';

const documentStorageApiHost = () => {
	return `${config.documentStorageApi.host}`;
};

/**
 * @param {{caseType: string, caseReference: string, documentName: string, GUID: string}[]} documentsToSave
 * @returns {Promise<{blobStorageHost: string, blobStorageContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]}>}
 */
export const getStorageLocation = async (documentsToSave) => {
	const response = await got.post(`${documentStorageApiHost()}/document-location`, {
		json: documentsToSave
	});

	return response.json();
};
