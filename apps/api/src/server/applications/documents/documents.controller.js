import { pick } from 'lodash-es';
import * as caseRepository from '../../repositories/case.repository.js';
import * as documentRepository from '../../repositories/document.repository.js';
import * as folderRepository from '../../repositories/folder.repository.js';
import { getStorageLocation } from '../../utils/document-storage-api-client.js';
import {
	formatResponseBody,
	nextStatusInDocumentStateMachine
} from '../application/application.service.js';

/**
 *
 * @type {import('express').RequestHandler<any, ?, ?, any>}
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
	const documents = body[''];

	const caseFromDatabase = await caseRepository.getById(params.id, {});

	const documentsToSendToDatabase = documents.map(
		(/** @type {{ documentName: any; folderId: any; }} */ document) => {
			return { name: document.documentName, folderId: document.folderId };
		}
	);

	const documentsFromDatabase = await Promise.all(
		documentsToSendToDatabase.map(
			(/** @type {{ name: string; folderId: number; }} */ documentToDatabase) => {
				return documentRepository.upsert(documentToDatabase);
			}
		)
	);

	const requestToDocumentStorage = documentsFromDatabase.map((document) => {
		return {
			caseType: 'application',
			caseReference: caseFromDatabase?.reference,
			GUID: document.guid,
			documentName: document.name
		};
	});

	const responseFromDocumentStorage = await getStorageLocation(requestToDocumentStorage);

	await Promise.all(
		responseFromDocumentStorage.documents.map((documentWithPath) => {
			return documentRepository.update(documentWithPath.GUID, {
				blobStorageContainer: responseFromDocumentStorage.blobStorageContainer,
				blobStoragePath: documentWithPath.blobStoreUrl
			});
		})
	);

	const documentsWithUrls = responseFromDocumentStorage.documents.map((document) => {
		return pick(document, ['documentName', 'blobStoreUrl']);
	});

	response.send({
		blobStorageHost: responseFromDocumentStorage.blobStorageHost,
		blobStorageContainer: responseFromDocumentStorage.blobStorageContainer,
		documents: documentsWithUrls
	});
};

/**
 * @param {string} guid
 * @param {string} status
 */
export const updatedDocumentStatusResponse = async (guid, status) => {
	const updatedResponse = await documentRepository.updateDocumentStatus({
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
		updateResponseInTable.guid,
		updateResponseInTable.status
	);

	response.send(formattedResponse);
};
