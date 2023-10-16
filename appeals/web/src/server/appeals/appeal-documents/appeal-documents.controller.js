import config from '@pins/appeals.web/environment/config.js';
import logger from '#lib/logger.js';
import { mapFolderToAddDetailsPageParams } from './appeal-documents.mapper.js';
import { getDocumentRedactionStatuses, updateDocuments } from './appeal.documents.service.js';
import { mapDocumentDetailsFormDataToAPIRequest } from './appeal-documents.mapper.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 * @param {string} [nextPageUrl]
 */
export const renderDocumentUpload = async (request, response, backButtonUrl, nextPageUrl) => {
	const { appealId, documentId } = request.params;
	const { currentFolder } = request;

	if (!currentFolder) {
		return response.status(404).render('app/404');
	}

	const pathComponents = currentFolder.path.split('/');
	const documentStage = pathComponents[0];
	const documentType = pathComponents[1];

	return response.render('appeals/documents/document-upload.njk', {
		backButtonUrl: backButtonUrl?.replace('{{folderId}}', currentFolder.id),
		caseId: appealId,
		folderId: currentFolder.id,
		documentId,
		useBlobEmulator: config.useBlobEmulator,
		blobStorageHost:
			config.useBlobEmulator === true ? config.blobEmulatorSasUrl : config.blobStorageUrl,
		blobStorageContainer: config.blobStorageDefaultContainer,
		multiple: !documentId,
		documentStage: documentStage,
		documentType: documentType,
		nextPageUrl:
			nextPageUrl?.replace('{{folderId}}', currentFolder.id) ||
			backButtonUrl?.replace('{{folderId}}', currentFolder.id)
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 * @param {string} [nextPageUrl]
 */
export const renderDocumentDetails = async (request, response, backButtonUrl, nextPageUrl) => {
	const { currentFolder } = request;

	if (!currentFolder) {
		return response.status(404).render('app/404');
	}

	const mappedDocumentData = mapFolderToAddDetailsPageParams(currentFolder);

	return response.render('appeals/documents/add-document-details.njk', {
		backButtonUrl: backButtonUrl?.replace('{{folderId}}', currentFolder.id),
		folderId: currentFolder.id,
		useBlobEmulator: config.useBlobEmulator,
		blobStorageHost:
			config.useBlobEmulator === true ? config.blobEmulatorSasUrl : config.blobStorageUrl,
		blobStorageContainer: config.blobStorageDefaultContainer,
		nextPageUrl:
			nextPageUrl?.replace('{{folderId}}', currentFolder.id) ||
			backButtonUrl?.replace('{{folderId}}', currentFolder.id),
		documentTypeHeading: mappedDocumentData.folderName,
		detailsItems: mappedDocumentData.detailsItems
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 */
export const postDocumentDetails = async (request, response) => {
	try {
		const {
			body,
			apiClient,
			params: { appealId }
		} = request;

		const redactionStatuses = await getDocumentRedactionStatuses(apiClient);

		if (redactionStatuses) {
			const apiRequest = mapDocumentDetailsFormDataToAPIRequest(body, redactionStatuses);
			const updateDocumentsResult = await updateDocuments(apiClient, appealId, apiRequest);

			if (updateDocumentsResult) {
				request.session.documentAdded = true;
				return response.redirect(
					body?.nextPageUrl || `/appeals-service/appeal-details/${appealId}/appellant-case/`
				);
			}
		}

		return response.render('app/500.njk');
	} catch (error) {
		logger.error(
			error,
			error instanceof Error ? error.message : 'Something went wrong when adding document details'
		);

		return response.render('app/500.njk');
	}
};
