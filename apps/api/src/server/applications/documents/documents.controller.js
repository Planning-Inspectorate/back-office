import { pick } from 'lodash-es';
import * as documentRepository from '../../repositories/document.repository.js';
import * as documentVersionRepository from '../../repositories/document-metadata.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import {
	formatResponseBody,
	nextStatusInDocumentStateMachine
} from '../application/application.service.js';
import { obtainURLsForDocuments } from '../application/documents/document.service.js';

/**
 * Provides document upload URLs.
 *
 * @type {import('express').RequestHandler<any, any, any, any>}
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
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
 */
export const updatedDocumentStatusResponse = async (guid, status) => {
	const updatedResponse = await documentVersionRepository.updateDocumentStatus({
		guid,
		status
	});

	return updatedResponse;
};

/**
 * @type {import('express').RequestHandler<{caseId: string, documentGUID: string }>}
 */
export const updateDocumentStatus = async ({ params, body }, response) => {
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
		updateResponseInTable.documentGuid,
		updateResponseInTable.publishedStatus
	);

	response.send(formattedResponse);
};
