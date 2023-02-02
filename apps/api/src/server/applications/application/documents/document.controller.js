import { pick } from 'lodash-es';
import * as caseRepository from '../../../repositories/case.repository.js';
import * as documentRepository from '../../../repositories/document.repository.js';
import AppError from '../../../utils/app-error.js';
import { DOCUMENT_STATUS } from '../../../utils/document-enum.js';
import { getStorageLocation } from '../../../utils/document-storage-api-client.js';
import { mapSingleDocumentDetails } from '../../../utils/mapping/map-document-details.js';
/**
 * @typedef {import('apps/api/prisma/schema.js').Document} Document
 * @typedef {import('apps/api/prisma/schema.js').DocumentDetails} DocumentDetails
 */
import { getDocumentByIdAndCaseId } from './document.validators.js';

/**
 *
 * @type {import('express').RequestHandler<any, ?, ?, any>}
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
	const documents = body[''];

	const caseFromDatabase = await caseRepository.getById(params.id, {});

	const documentsToSendToDatabase = documents.map(
		(
			/** @type {{ documentName: any; folderId: any; documentType: string; documentSize: number }} */ document
		) => {
			return {
				name: document.documentName,
				folderId: document.folderId,
				fileType: document.documentType,
				fileSize: document.documentSize
			};
		}
	);

	const documentsFromDatabase = await Promise.all(
		documentsToSendToDatabase.map(
			(
				/** @type {{ name: string; folderId: number; fileType: string; fileSize: number }} */ documentToDatabase
			) => {
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

/**
 * Gets the properties for a single document
 *
 * @type {import('express').RequestHandler<{guid: string}, ?, ?, any>}
 */
export const getDocumentProperties = async ({ params }, response) => {
	let /** @type { Document |null} */ document = null;
	let /** @type { DocumentDetails |null} */ documentDetails = null;

	try {
		document = await documentRepository.getById(params.guid);

		if (document === null || typeof document === 'undefined') {
			return next(new AppError(`Unknown document guid ${params.guid}`, 400));
		}
		documentDetails = mapSingleDocumentDetails(document);
	} catch {
		return next(new AppError(`Unknown document guid ${params.guid}`, 400));
	}

	response.send(documentDetails);
};

/**
 * add soft delete flag to db so that this document cannot be accessible.
 *
 * @type {import('express').RequestHandler<{id:string; guid: string;}, ?, ?, any>}
 */
export const softDeleteDocument = async ({ params: { id: caseId, guid } }, response) => {
	const document = await getDocumentByIdAndCaseId(guid, +caseId);

	if (!document) {
		throw new AppError(`document not found guid ${guid} related to casedId ${caseId}`, 404);
	}

	const documentIsPublished = document.status === DOCUMENT_STATUS.PUBLISHED;

	if (documentIsPublished) {
		throw new AppError(`unable to archive document guid ${guid} related to casedId ${caseId}`, 400);
	}

	const isDeleted = true;

	await documentRepository.update(guid, {
		isDeleted
	});

	response.status(200).send({ isDeleted });
};
