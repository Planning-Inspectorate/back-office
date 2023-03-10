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
 * Remove extension from document name
 *
 * @param {string} documentNameWithExtension
 * @returns {string}
 */
export const documentName = (documentNameWithExtension) => {
	if (!documentNameWithExtension.includes('.')) return documentNameWithExtension;

	const documentNameSplit = documentNameWithExtension.split('.');

	documentNameSplit.pop();

	return documentNameSplit.join('.');
};

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
 * @param {{name: string, folderId: number; documentType: string, documentSize: number}[]} documents
 * @returns {Promise<import('@pins/api').Schema.Document[]>}
 */
const upsertDocumentsToDatabase = async (documents) => {
	// Use PromisePool to concurrently process the documents with a concurrency of 5.

	const { results } = await PromisePool.withConcurrency(5)
		.for(documents)
		.handleError((error) => {
			// Log any errors that occur during the upsert process and re-throw the error.
			logger.error(`Error while upserting documents to database: ${error}`);
			throw error;
		})
		.process(async (documentToDB) => {
			// Log that the function is upserting the document to the database.

			logger.info(`Upserting document to database: ${documentToDB}`);

			// Call the documentRepository.upsert function to upsert the document to the database.
			const document = await documentRepository.upsert({
				name: documentName(documentToDB.name),
				folderId: documentToDB.folderId
			});

			// Log that the document has been upserted and its GUID.
			logger.info(`Upserted document with guid: ${document.guid}`);

			// Call the documentVersionRepository.upsert function to upsert metadata for the document to the database.
			await documentVerisonRepository.upsert({
				documentGuid: document.guid,
				originalFilename: documentName(document.name),
				mime: documentToDB.documentType,
				size: documentToDB.documentSize
			});

			// Log that the metadata for the document has been upserted and its GUID.
			logger.info(`Upserted metadata for document with guid: ${document.guid}`);

			return document;
		});

	// Log the total number of documents that were upserted to the database.

	logger.info(`Upserted ${results.length} documents to database`);

	// Return the array of upserted documents.

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
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number}[]} documentsToUpload
 * @param {{ blobStoreUrl: string;caseType: string;documentName: string;GUID: string;}[]} blobStorageDocuments
 *  @param {string} blobStorageContainer
 * @returns {Promise<void>}}
 */

const upsertDocumentVersionsMetadataToDatabase = async (
	documentsToUpload,
	blobStorageDocuments,
	blobStorageContainer
) => {
	const documentNameMap = new Map();

	for (const document of blobStorageDocuments) {
		documentNameMap.set(document.documentName, document);
	}

	/** @type {Partial<DocumentVersion>[]} */
	const documentsMetadataToSendToDatabase = documentsToUpload.map((documentToUpload) => {
		/** @type {{blobStoreUrl:string;documentName: string;GUID: string;}} */
		const document = documentNameMap.get(documentToUpload.documentName);

		return {
			blobStorageContainer,
			documentGuid: document.GUID,
			// blobStoragePath: document.blobStoreUrl,
			documentURI: document.blobStoreUrl
		};
	});

	await Promise.all(
		documentsMetadataToSendToDatabase.map((metadata) => documentVerisonRepository.upsert(metadata))
	);

	documentNameMap.clear();
};

/**
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number}[]} documentsToUpload
 * @param {number} caseId
 * @returns {Promise<{blobStorageHost: string, blobStorageContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]}>}}
 */
export const obtainURLsForDocuments = async (documentsToUpload, caseId) => {
	// Step 1: Retrieve the case object associated with the provided caseId
	logger.info(`Retrieving case for caseId ${caseId}...`);

	const caseForDocuments = await caseRepository.getById(+caseId, {});

	logger.info(`Case retrieved: ${JSON.stringify(caseForDocuments)}`);

	// Step 2: Check if the case object is found and has a reference
	logger.info(`Checking if case has reference...`);

	if (caseForDocuments == null || caseForDocuments.reference == null) {
		throw new Error('Case not found or has no reference');
	}

	logger.info(`Case has reference`);

	// Step 3: Map documents to the format expected by the database
	logger.info(`Mapping documents to database format...`);

	const documentsToSendToDatabase = mapDocumentsToSendToDatabase(documentsToUpload);

	logger.info(`Documents mapped: ${JSON.stringify(documentsToSendToDatabase)}`);

	// Step 4: Upsert the documents to the database
	logger.info(`Upserting documents to database...`);

	const documentsFromDatabase = await upsertDocumentsToDatabase(documentsToSendToDatabase);

	logger.info(`Documents upserted: ${JSON.stringify(documentsFromDatabase)}`);

	// Step 5: Map documents to the format expected by the blob storage service
	logger.info(`Mapping documents to blob storage format...`);

	const requestToDocumentStorage = mapDocumentsToSendToBlobStorage(
		documentsFromDatabase,
		caseForDocuments.reference
	);

	logger.info(`Documents mapped: ${JSON.stringify(requestToDocumentStorage)}`);

	// Step 6: Send a request to the blob storage service to get the storage location for each document

	logger.info(`Sending request to blob storage service...`);

	const responseFromDocumentStorage = await getStorageLocation(requestToDocumentStorage);

	logger.info(`Response from blob storage service: ${JSON.stringify(responseFromDocumentStorage)}`);

	// Step 7: Upsert document versions metadata to the database
	logger.info(`Upserting document versions metadata to database...`);

	await upsertDocumentVersionsMetadataToDatabase(
		documentsToUpload,
		responseFromDocumentStorage.documents,
		responseFromDocumentStorage.blobStorageContainer
	);

	// Step 8: Return the response from the blob storage service, including information about the uploaded documents and their storage location
	logger.info(`Returning response from blob storage service...`);
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
