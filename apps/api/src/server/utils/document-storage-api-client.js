import got from 'got';
import config from '../config/config.js';

const documentStorageApiHost = () => {
	return `http://${config.documentStorageApi.host}:${config.documentStorageApi.port}`;
};

/**
 * @param {object[]} documentsToSave
 * @returns {Promise<{blobStorageHost: string, blobStorageContainer: string, documents: object[]}>}
 */
export const getStorageLocation = async (documentsToSave) => {
	return got
		.post(`${documentStorageApiHost()}/document-location`, { json: documentsToSave })
		.json();
};
