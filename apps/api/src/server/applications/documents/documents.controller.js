import { pick } from 'lodash-es';
import * as documentRepository from '../../repositories/document.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import {
	formatResponseBody,
	nextStatusInDocumentStateMachine
} from '../application/application.service.js';
import { obtainURLsForDocuments } from '../application/documents/document.service.js';

/**
 * Provides document upload URLs.
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export const provideDocumentUploadURLs = async (request, response) => {
	const { params, body } = request;
	const documentsToUpload = body[''];

	const { blobStorageHost, blobStorageContainer, documents } = await obtainURLsForDocuments(
		documentsToUpload,
		params.id
	);

	const documentsWithUrls = documents.map((document) => {
		return pick(document, ['documentName', 'blobStoreUrl']);
	});

	response.send({
		blobStorageHost,
		blobStorageContainer,
		documents: documentsWithUrls
	});
};

/**
 * @param {string} guid
 * @param {string} status
 * @returns {Promise<object>}
 */
export const updatedDocumentStatusResponse = async (guid, status) => {
	const updatedResponse = await documentRepository.updateDocumentStatus({
		guid,
		status
	});

	return updatedResponse;
};

/**
 * Handles requests to update a document's status.
 *
 * @param {import('express').Request<{caseId: string, documentGUID: string }, any, any, any, {}>} request
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export const updateDocumentStatus = async (request, response) => {
	const { params, body } = request;

	const documentDetails = await documentRepository.getByDocumentGUID(params.documentGUID);

	const folderId = documentDetails?.folderId;

	const caseIdFromFolderRepository = await folderRepository.getById(folderId);

	const caseId = caseIdFromFolderRepository?.caseId;

	const documentStatus = documentDetails?.status;

	const nextStatus = nextStatusInDocumentStateMachine(documentStatus, body.machineAction);

	const updateResponseInTable = await updatedDocumentStatusResponse(
		params.documentGUID,
		nextStatus
	);

	const formattedResponse = formatResponseBody(
		caseId,
		updateResponseInTable.guid,
		updateResponseInTable.status
	);

	response.send(formattedResponse);
};
