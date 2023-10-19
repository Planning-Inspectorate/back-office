import config from '@pins/appeals.web/environment/config.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 */
export const renderDocumentUpload = async (request, response, backButtonUrl) => {
	const { appealId, documentId } = request.params;
	const { currentFolder } = request;

	if (!currentFolder) {
		return response.status(404).render('app/404');
	}

	const pathComponents = currentFolder.path.split('/');
	const documentStage = pathComponents[0];
	const documentType = pathComponents[1];

	return response.render('appeals/documents/document-upload.njk', {
		backButtonUrl,
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
