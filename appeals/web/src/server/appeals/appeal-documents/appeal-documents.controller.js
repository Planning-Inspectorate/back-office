import config from '@pins/appeals.web/environment/config.js';

/** @type {import('@pins/express').RenderHandler<object>}  */
export const upload = async (request, response) => {
	const { appealId, documentId } = request.params;
	const { currentFolder } = request;

	if (!currentFolder) {
		return response.status(404).render('app/404');
	}

	const pathComponents = currentFolder.path.split('/');
	const documentStage = pathComponents[0];
	const documentType = pathComponents[1];

	return response.render('appeals/documents/document-upload.njk', {
		backButtonUrl: request.originalUrl?.split('documents/')?.[0] || '/',
		caseId: appealId,
		folderId: currentFolder.id,
		documentId,
		useBlobEmulator: config.useBlobEmulator,
		blobStorageHost:
			config.useBlobEmulator === true ? config.blobEmulatorSasUrl : config.blobStorageUrl,
		blobStorageContainer: config.blobStorageDefaultContainer,
		multiple: !documentId,
		documentStage: documentStage,
		documentType: documentType
	});
};
