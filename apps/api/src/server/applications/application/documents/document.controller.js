import { pick } from 'lodash-es';
import * as caseRepository from '../../../repositories/case.repository.js';
import * as documentRepository from '../../../repositories/document.repository.js';
import { getStorageLocation } from '../../../utils/document-storage-api-client.js';

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
 * Updates the status and / or redaction status of an array of documents
 * There can be a status parameter, or a redacted parameter, or both
 *
 * @type {import('express').RequestHandler<{id: number}, ?, ?, any>}
 */
export const updateDocuments = async ({ body }, response) => {
	const { status, redacted, items } = body[''];

	if (items) {
		for (const document of items) {
			await documentRepository.update(document.guid, { status, redacted });
		}
	}
	response.send(items);
};
