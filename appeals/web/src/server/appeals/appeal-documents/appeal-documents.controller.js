import config from '@pins/appeals.web/environment/config.js';

/** @type {import('@pins/express').RenderHandler<object>}  */
export const upload = async (request, response) => {
	const { appealId, folderId, documentId } = request.params;
	const { currentFolder } = request;

	if (!currentFolder) {
		return response.status(404).render('app/404');
	}
	return response.render('appeals/documents/document-upload.njk', {
		caseId: appealId,
		folderId,
		documentId,
		useBlobEmulator: config.useBlobEmulator,
		blobStorageHost:
			config.useBlobEmulator === true ? config.blobEmulatorSasUrl : config.blobStorageUrl,
		blobStorageContainer: config.blobStorageDefaultContainer,
		multiple: !documentId,
		folderName: currentFolder.displayName,
		folderPath: currentFolder.path
	});
};
