import config from '@pins/appeals.web/environment/config.js';

/** @type {import('@pins/express').RenderHandler<object>}  */
export const upload = async (request, response) => {
	const { appealId, folderId, documentId } = request.params;

	return response.render('appeals/documents/document-upload.njk', {
		caseId: appealId,
		folderId,
		documentId,
		useBlobEmulator: config.useBlobEmulator,
		blobStorageHost:
			config.useBlobEmulator === true ? config.blobEmulatorSasUrl : config.blobStorageUrl,
		blobStorageContainer: config.blobStorageDefaultContainer
	});
};

/** @type {import('@pins/express').RenderHandler<object>}  */
export const download = async (request, response) => {
	return response.render('appeals/documents/document-download.njk', {});
};

/** @type {import('@pins/express').RenderHandler<object>}  */
export const listFolders = async (request, response) => {
	return response.render('appeals/documents/folders.njk', {});
};

// todo
//export const listFolders()
//export const listFiles()
