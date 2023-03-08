import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import * as caseRepository from '../../../repositories/case.repository.js';
import * as documentRepository from '../../../repositories/document.repository.js';
import * as documentVerisonRepository from '../../../repositories/document-metadata.repository.js';
import { getStorageLocation } from '../../../utils/document-storage-api-client.js';
import logger from '../../../utils/logger.js';
import { mapSingleDocumentDetailsFromVersion } from '../../../utils/mapping/map-document-details.js';

/** @typedef {import('apps/api/prisma/schema.js').DocumentDetails} DocumentDetails */

/**  @typedef {import('apps/api/prisma/schema.js').DocumentVersion} DocumentVersion */

/**
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number}[]} documents
 * @returns {{name: string, folderId: number; documentType: string, documentSize: number}[]}
 */
const mapDocumentsToSendToDatabase = (documents) => {
	return documents?.map((document) => {
		return {
			name: document.documentName,
			folderId: document.folderId,
			documentType: document.documentType,
			documentSize: document.documentSize
		};
	});
};

/**
 *
 * @param {{name: string, folderId: number}[]} documents
 * @returns {Promise<import('@pins/api').Schema.Document[]>}
 */
const upsertDocumentsToDatabase = async (documents) => {
	const { results } = await PromisePool.withConcurrency(5)
		.for(documents)
		.handleError((error) => {
			logger.error(`Error while upserting documents to database: ${error}`);
			throw error;
		})
		.process(async (documentToDB) => {
			logger.info(`Upserting document to database: ${documentToDB}`);

			const document = await documentRepository.upsert({
				name: documentToDB.name,
				folderId: documentToDB.folderId
			});

			logger.info(`Upserted document with guid: ${document.guid}`);

			await documentVerisonRepository.upsert({
				documentGuid: document.guid,
				originalFilename: document.name,
				mime: documentToDB.documentType,
				size: documentToDB.documentSize
			});

			logger.info(`Upserted metadata for document with guid: ${document.guid}`);

			return document;
		});

	logger.info(`Upserted ${results.length} documents to database`);

	return results;
};

/**
 * @param {import('@pins/api').Schema.Document[]} documents
 * @param {string} caseReference
 * @returns {{caseType: string, caseReference: string, GUID: string, documentName: string}[]}
 */
const mapDocumentsToSendToBlobStorage = (documents, caseReference) => {
	return documents.map((document) => {
		return {
			caseType: 'application',
			caseReference,
			GUID: document.guid,
			documentName: document.name
		};
	});
};

/**
 *
 * @param {{blobStoreUrl: string, caseType: string, caseReference: string, documentName: string, GUID: string}[]} documents
 * @param {string} blobStorageContainer
 */
const updateDocumentsWithContainersAndPaths = async (documents, blobStorageContainer) => {
	await Promise.all(
		documents.map((documentWithPath) => {
			return documentRepository.update(documentWithPath.GUID, {
				blobStorageContainer,
				blobStoragePath: documentWithPath.blobStoreUrl
			});
		})
	);
};

/**
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number}[]} documentsToUpload
 * @param {{ blobStoreUrl: string;caseType: string;documentName: string;GUID: string;}[]} blobStorageDocuments
 * @returns {Promise<void>}}
 */

const upsertDocumentsMetadataToDatabase = async (documentsToUpload, blobStorageDocuments) => {
	const documentNameMap = new Map();

	for (const document of blobStorageDocuments) {
		documentNameMap.set(document.documentName, document);
	}

	/** @type {Partial<DocumentVersion>[]} */
	const documentsMetadataToSendToDatabase = documentsToUpload.map((documentToUpload) => {
		/** @type {{blobStoreUrl:string;documentName: string;GUID: string;}} */
		const document = documentNameMap.get(documentToUpload.documentName);

		return {
			documentGuid: document.GUID,
			documentURI: document.blobStoreUrl
		};
	});

	await Promise.all(
		documentsMetadataToSendToDatabase.map((metadata) => documentVerisonRepository.upsert(metadata))
	);

	documentNameMap.clear();
};

/**
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number}[]} documentsToUpload
 * @param {number} caseId
 * @returns {Promise<{blobStorageHost: string, blobStorageContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]}>}}
 */
export const obtainURLsForDocuments = async (documentsToUpload, caseId) => {
	const caseForDocuments = await caseRepository.getById(+caseId, {});

	if (caseForDocuments == null || caseForDocuments.reference == null) {
		throw new Error('Case not found or has no reference');
	}

	const documentsToSendToDatabase = mapDocumentsToSendToDatabase(documentsToUpload);

	const documentsFromDatabase = await upsertDocumentsToDatabase(documentsToSendToDatabase);

	const requestToDocumentStorage = mapDocumentsToSendToBlobStorage(
		documentsFromDatabase,
		caseForDocuments.reference
	);

	const responseFromDocumentStorage = await getStorageLocation(requestToDocumentStorage);

	await upsertDocumentsMetadataToDatabase(documentsToUpload, responseFromDocumentStorage.documents);

	await updateDocumentsWithContainersAndPaths(
		responseFromDocumentStorage.documents,
		responseFromDocumentStorage.blobStorageContainer
	);

	return responseFromDocumentStorage;
};

/**
 * Upserts the metadata for a document with the provided GUID using the provided metadata body.
 *
 * @param {string} documentGuid - The GUID of the document to upsert metadata for.
 * @param {DocumentVersion} documentVersionBody - The metadata body to use for upserting.
 * @returns {Promise<DocumentDetails>} A promise that resolves with the document details after the upsert.
 */
export const upsertDocumentVersionAndReturnDetails = async (documentGuid, documentVersionBody) => {
	const documentVersion = await documentVerisonRepository.upsert({
		...documentVersionBody,
		documentGuid
	});

	return mapSingleDocumentDetailsFromVersion(documentVersion);
};
