import config from '@pins/appeals.web/environment/config.js';
import logger from '#lib/logger.js';
import {
	getDocumentRedactionStatuses,
	updateDocuments,
	getFileVersionsInfo,
	getFileInfo,
	deleteDocument
} from './appeal.documents.service.js';
import {
	mapDocumentDetailsFormDataToAPIRequest,
	addDocumentDetailsPage,
	manageFolderPage,
	manageDocumentPage,
	mapRedactionStatusIdToName,
	changeDocumentDetailsPage,
	deleteDocumentPage
} from './appeal-documents.mapper.js';

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
	let documentName;
	let pageHeadingText;

	if (request.params.documentId) {
		const fileInfo = await getFileInfo(request.apiClient, appealId, request.params.documentId);
		documentName = fileInfo?.latestDocumentVersion.fileName;
		pageHeadingText = 'Upload an updated document';
	}

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
		serviceName: documentName,
		pageHeadingText: pageHeadingText,
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

	const mappedPageContent = addDocumentDetailsPage(backButtonUrl, currentFolder, body?.items);

	return response.render('appeals/documents/add-document-details.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 * @param {string} viewAndEditUrl
 */
export const renderManageFolder = async (request, response, backButtonUrl, viewAndEditUrl) => {
	const { currentFolder, errors } = request;

	if (!currentFolder) {
		return response.status(404).render('app/404.njk');
	}

	const redactionStatuses = await getDocumentRedactionStatuses(request.apiClient);

	if (!redactionStatuses) {
		return response.render('app/500.njk');
	}

	const mappedPageContent = manageFolderPage(
		backButtonUrl,
		viewAndEditUrl,
		currentFolder,
		redactionStatuses,
		request
	);

	return response.render('appeals/documents/manage-folder.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 * @param {string} uploadUpdatedDocumentUrl
 * @param {string} removeDocumentUrl
 */
export const renderManageDocument = async (
	request,
	response,
	backButtonUrl,
	uploadUpdatedDocumentUrl,
	removeDocumentUrl
) => {
	const {
		currentFolder,
		errors,
		params: { appealId, documentId }
	} = request;

	if (!currentFolder) {
		return response.status(404).render('app/404.njk');
	}

	const [document, redactionStatuses] = await Promise.all([
		getFileVersionsInfo(request.apiClient, appealId, documentId),
		getDocumentRedactionStatuses(request.apiClient)
	]);

	if (!document) {
		return response.status(404).render('app/404.njk');
	}

	if (!redactionStatuses) {
		return response.render('app/500.njk');
	}

	const mappedPageContent = await manageDocumentPage(
		appealId,
		backButtonUrl,
		uploadUpdatedDocumentUrl,
		removeDocumentUrl,
		redactionStatuses,
		document,
		currentFolder,
		request
	);

	return response.render('appeals/documents/manage-document.njk', {
		pageContent: mappedPageContent,
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

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 */
export const renderChangeDocumentDetails = async (request, response, backButtonUrl) => {
	const { currentFolder, body, errors } = request;
	const { appealId, documentId } = request.params;
	let items = body?.items;

	if (!items) {
		const [redactionStatuses, currentFile] = await Promise.all([
			getDocumentRedactionStatuses(request.apiClient),
			getFileInfo(request.apiClient, appealId, documentId)
		]);

		if (redactionStatuses && currentFile) {
			const receivedDate = new Date(currentFile?.latestDocumentVersion?.dateReceived);
			const redactionStatus = mapRedactionStatusIdToName(
				redactionStatuses,
				currentFile?.latestDocumentVersion?.redactionStatusId
			).toLowerCase();
			items ??= [
				{
					documentId: documentId,
					receivedDate: {
						day: receivedDate.getDate().toString(),
						month: (receivedDate.getMonth() + 1).toString(),
						year: receivedDate.getFullYear().toString()
					},
					redactionStatus: redactionStatus
				}
			];
		}
	}
	if (!currentFolder) {
		return response.status(404).render('app/404.njk');
	}

	const mappedPageContent = changeDocumentDetailsPage(backButtonUrl, currentFolder, items);

	return response.render('appeals/documents/add-document-details.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 * @param {string} [nextPageUrl]
 */
export const postChangeDocumentDetails = async (request, response, backButtonUrl, nextPageUrl) => {
	try {
		const {
			body,
			apiClient,
			params: { appealId },
			errors
		} = request;

		if (errors) {
			return renderChangeDocumentDetails(request, response, backButtonUrl);
		}

		const redactionStatuses = await getDocumentRedactionStatuses(apiClient);

		if (redactionStatuses) {
			const apiRequest = mapDocumentDetailsFormDataToAPIRequest(body, redactionStatuses);
			const updateDocumentsResult = await updateDocuments(apiClient, appealId, apiRequest);

			if (updateDocumentsResult) {
				addNotificationBannerToSession(
					request.session,
					'documentDetailsUpdated',
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

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} backButtonUrl
 */
export const renderDeleteDocument = async (request, response, backButtonUrl) => {
	const {
		currentFolder,
		errors,
		params: { appealId, documentId, versionId }
	} = request;

	if (!currentFolder) {
		return response.status(404).render('app/404.njk');
	}

	const [document, redactionStatuses] = await Promise.all([
		getFileVersionsInfo(request.apiClient, appealId, documentId),
		getDocumentRedactionStatuses(request.apiClient)
	]);

	if (!document) {
		return response.status(404).render('app/404.njk');
	}

	if (!redactionStatuses) {
		return response.render('app/500.njk');
	}

	const mappedPageContent = await deleteDocumentPage(
		backButtonUrl,
		redactionStatuses,
		document,
		currentFolder,
		versionId
	);

	return response.render('appeals/documents/delete-document.njk', {
		pageContent: mappedPageContent,
		errors
	});
};

/**
 *
 * @param {import('@pins/express/types/express.js').Request} request
 * @param {import('@pins/express/types/express.js').RenderedResponse<any, any, Number>} response
 * @param {string} returnUrl
 * @param {string} uploadNewDocumentVersionUrl
 */
export const postDocumentDelete = async (
	request,
	response,
	returnUrl,
	uploadNewDocumentVersionUrl
) => {
	const {
		apiClient,
		currentFolder,
		body,
		errors,
		params: { appealId, documentId, versionId }
	} = request;

	if (errors) {
		return renderDeleteDocument(request, response, returnUrl);
	}

	if (!currentFolder) {
		return response.status(404).render('app/404.njk');
	}

	if (!body['delete-file-answer'] || !appealId || !documentId || !versionId) {
		return response.render('app/500.njk');
	}

	const returnUrlProcessed = returnUrl?.replace('{{folderId}}', currentFolder.id);
	const uploadNewDocumentVersionUrlProcessed = uploadNewDocumentVersionUrl
		?.replace('{{folderId}}', currentFolder.id)
		.replace('{{documentId}}', documentId);

	if (body['delete-file-answer'] === 'no') {
		return response.redirect(returnUrlProcessed);
	} else if (body['delete-file-answer'] === 'yes') {
		await deleteDocument(apiClient, appealId, documentId, versionId);
		addNotificationBannerToSession(
			request.session,
			'documentDeleted',
			Number.parseInt(appealId, 10)
		);
		return response.redirect(returnUrlProcessed);
	} else if (body['delete-file-answer'] === 'yes-and-upload-new-document') {
		await deleteDocument(apiClient, appealId, documentId, versionId);
		return response.redirect(uploadNewDocumentVersionUrlProcessed);
	}

	return response.render('app/500.njk');
};
