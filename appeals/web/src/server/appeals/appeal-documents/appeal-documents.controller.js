import config from '@pins/appeals.web/environment/config.js';
import logger from '#lib/logger.js';
import { mapFolderToAddDetailsPageParams } from './appeal-documents.mapper.js';
import { getDocumentRedactionStatuses, updateDocuments } from './appeal.documents.service.js';
import { mapDocumentDetailsFormDataToAPIRequest } from './appeal-documents.mapper.js';
import { addNotificationBannerToSession } from '#lib/session-utilities.js';

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 * @param {string} [nextPageUrl]
 */
export const renderDocumentUpload = async (request, response, backButtonUrl, nextPageUrl) => {
	const { appealId, documentId } = request.params;
	const { currentFolder, errors } = request;

	if (!currentFolder) {
		return response.status(404).render('app/404');
	}

	const pathComponents = currentFolder.path.split('/');
	const documentStage = pathComponents[0];
	const documentType = pathComponents[1];

	return response.render('appeals/documents/document-upload.njk', {
		backButtonUrl: backButtonUrl?.replace('{{folderId}}', currentFolder.id),
		appealId,
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
			backButtonUrl?.replace('{{folderId}}', currentFolder.id),
		errors
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 */
export const renderDocumentDetails = async (request, response, backButtonUrl) => {
	const { currentFolder, body, errors } = request;

	if (!currentFolder) {
		return response.status(404).render('app/404.njk');
	}

	const mappedDocumentData = mapFolderToAddDetailsPageParams(currentFolder, body?.items);

	return response.render('appeals/documents/add-document-details.njk', {
		backButtonUrl: backButtonUrl?.replace('{{folderId}}', currentFolder.id),
		documentTypeHeading: mappedDocumentData.folderName,
		detailsItems: mappedDocumentData.detailsItems,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 * @param {string} [nextPageUrl]
 */
export const postDocumentDetails = async (request, response, backButtonUrl, nextPageUrl) => {
	try {
		const {
			body,
			apiClient,
			params: { appealId },
			errors
		} = request;

		if (errors) {
			return renderDocumentDetails(request, response, backButtonUrl);
		}

		const redactionStatuses = await getDocumentRedactionStatuses(apiClient);

		if (redactionStatuses) {
			const apiRequest = mapDocumentDetailsFormDataToAPIRequest(body, redactionStatuses);
			const updateDocumentsResult = await updateDocuments(apiClient, appealId, apiRequest);

			if (updateDocumentsResult) {
				addNotificationBannerToSession(
					request.session,
					'documentAdded',
					Number.parseInt(appealId, 10)
				);
				return response.redirect(nextPageUrl || `/appeals-service/appeal-details/${appealId}/`);
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
