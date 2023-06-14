import got from 'got';
import config from '../../../environment/config.js';

const documentStorageApiHost = () => {
	return `${config.documentStorageApi.host}`;
};

/**
 * @param {{caseType: string, caseReference: string, documentName: string, GUID: string}[]} documentsToSave
 * @returns {Promise<{blobStorageHost: string, blobStorageContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]}>}
 */
export const getStorageLocation = async (documentsToSave) => {
	return got
		.post(`${documentStorageApiHost()}/document-location`, {
			json: documentsToSave
		})
		.json();
};
