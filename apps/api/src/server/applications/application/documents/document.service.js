import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import * as caseRepository from '../../../repositories/case.repository.js';
import * as documentRepository from '../../../repositories/document.repository.js';
import * as documentVersionRepository from '../../../repositories/document-metadata.repository.js';
import * as documentActivityLogRepository from '../../../repositories/document-activity-log.repository.js';
import { getStorageLocation } from '../../../utils/document-storage-api-client.js';
import logger from '../../../utils/logger.js';
import { mapSingleDocumentDetailsFromVersion } from '../../../utils/mapping/map-document-details.js';
import { eventClient } from '../../../infrastructure/event-client.js';
import { buildNsipDocumentPayload } from './document.js';
import { NSIP_DOCUMENT } from '../../../infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { getFolder } from '../file-folders/folders.service.js';

/** @typedef {import('apps/api/src/database/schema.js').DocumentDetails} DocumentDetails */

/**  @typedef {import('apps/api/src/database/schema.js').DocumentVersion} DocumentVersion */

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
 * @param {number} caseId
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number, documentReference: string}[]} documents
 * @returns {{caseId: number, folderId: number; documentType: string, documentSize: number; documentReference: string}[]}
 */
const mapDocumentsToSendToDatabase = (caseId, documents) => {
	return documents?.map((document) => {
		return {
			caseId,
			documentName: document.documentName,
			folderId: document.folderId,
			documentType: document.documentType,
			documentSize: document.documentSize,
			documentReference: document.documentReference
		};
	});
};

/**
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number, documentReference: string}} document
 * @returns {{documentName: string, folderId: number; documentType: string, documentSize: number, reference: string}}
 */
const mapDocumentToSendToDatabase = (document) => {
	// TODO: Why are we duplicating this, why are the parameters different and why aren't we setting the caseId??
	return {
		documentName: document.documentName,
		folderId: document.folderId,
		documentType: document.documentType,
		documentSize: document.documentSize,
		reference: document.documentReference
	};
};

/**
 *
 * @param {number} folderId
 */
const getCaseStageMapping = async (folderId) => {
	const folder = await getFolder(folderId);
	return folder?.stage;
};

/**
 *
 * @param {number} caseId
 * @param {{documentName: string, folderId: number; documentType: string, documentSize: number, documentReference: string}[]} documents
 * @returns {Promise<{successful: import('@pins/applications.api').Schema.Document[], failed: string[]}>}
 */
const attemptInsertDocuments = async (caseId, documents) => {
	// Use PromisePool to concurrently process the documents with a concurrency of 5.

	/**
	 * @type {Set<string>}
	 * */
	let failed = new Set();

	const { results } = await PromisePool.withConcurrency(5)
		.for(documents)
		.handleError((error, doc) => {
			logger.error(`An error occurred while creating document: ${doc.documentName}: ${error}`);
			throw error;
		})
		.process(async (documentToDB) => {
			const fileName = documentName(documentToDB.documentName);

			logger.info(`Inserting document to database: ${documentToDB}`);

			let document;
			try {
				document = await documentRepository.create({
					caseId,
					folderId: documentToDB.folderId,
					reference: documentToDB.documentReference
				});
			} catch (err) {
				failed.add(documentToDB.documentName);
				return;
			}

			logger.info(`Inserted document with guid: ${document.guid}`);

			// Get the cases stage to be applied to the document based on the folder
			const stage = await getCaseStageMapping(documentToDB.folderId);

			logger.info(`Upserting metadata for document with guid: ${document.guid}`);

			await documentVersionRepository.upsert({
				documentGuid: document.guid,
				fileName,
				originalFilename: documentToDB.documentName,
				mime: documentToDB.documentType,
				size: documentToDB.documentSize,
				stage: stage,
				version: 1
			});

			await documentRepository.update(document.guid, {
				latestVersionId: 1
			});

			logger.info(`Upserted metadata for document with guid: ${document.guid}`);

			return {
				...document,
				documentName: documentToDB.documentName
			};
		});

	logger.info(`Upserted ${results.length} documents to database`);

	const successful = /** @type {import('@pins/applications.api').Schema.Document[]} */ (
		results.filter(Boolean)
	);

	return { successful, failed: Array.from(failed) };
};

/**
 * @param {{guid: string, documentName: string, reference: string}[]} documents
 * @param {string} caseReference
 * @returns {{caseType: string, caseReference: string, GUID: string, version: number}[]}
 */
const mapDocumentsToSendToBlobStorage = (documents, caseReference) => {
	return documents.map((document) => {
		return {
			caseType: 'application',
			caseReference,
			GUID: document.guid,
			documentName: document.documentName,
			documentReference: document?.reference,
			version: 1
		};
	});
};

/**
 * Upserts metadata for a set of documents to a database.
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number}[]} documentsToUpload - Array of documents to upload metadata for.
 * @param {{blobStoreUrl: string;caseType: string;documentName: string;GUID: string;}[]} blobStorageDocuments - Array of documents containing metadata to upsert.
 * @param {string} privateBlobContainer - Name of the blob storage container where documents are stored.
 * @returns {Promise<void>}
 */
const upsertDocumentVersionsMetadataToDatabase = async (
	blobStorageDocuments,
	privateBlobContainer
) => {
	// Generate an array of documents to upsert, with metadata pulled from the blob storage documents
	const documentsMetadataToSendToDatabase = blobStorageDocuments.map((documentToUpload) => {
		// Create an object containing the metadata to upsert for the current document
		return {
			privateBlobContainer,
			documentGuid: documentToUpload.GUID,
			privateBlobPath: documentToUpload.blobStoreUrl
		};
	});

	// Use PromisePool to concurrently process the documents metadata with a concurrency of 5.
	await PromisePool.withConcurrency(5)
		.for(documentsMetadataToSendToDatabase)
		.handleError((error) => {
			// Log any errors that occur during the upsert process and re-throw the error.
			logger.error(`Error while upserting documents to database: ${error}`);
			throw error;
		})
		.process(async (metadata) => {
			// Log the metadata being upserted for debugging purposes
			logger.info(`Upserting document metadata: ${JSON.stringify(metadata)}`);

			// Upsert the metadata using the documentVerisonRepository
			return documentVersionRepository.upsert(metadata);
		});
};

/**
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number, documentReference: string}[]} documentsToUpload
 * @param {number} caseId
 * @returns {Promise<{response: {blobStorageHost: string, privateBlobContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]} | null, failedDocuments: string[]}>}}
 */
export const obtainURLsForDocuments = async (documentsToUpload, caseId) => {
	// Step 1: Retrieve the case object associated with the provided caseId
	logger.info(`Retrieving case for caseId ${caseId}...`);

	const caseForDocuments = await caseRepository.getById(Number(caseId), {});

	logger.info(`Case retrieved: ${JSON.stringify(caseForDocuments)}`);

	// Step 2: Check if the case object is found and has a reference
	logger.info(`Checking if case has reference...`);

	if (caseForDocuments == null || caseForDocuments.reference == null) {
		throw new Error('Case not found or has no reference');
	}

	logger.info(`Case has reference`);

	// Step 3: Map documents to the format expected by the database
	logger.info(`Mapping documents to database format...`);

	const documentsToSendToDatabase = mapDocumentsToSendToDatabase(caseId, documentsToUpload);

	//throw Error(JSON.stringify(documentsToSendToDatabase));

	logger.info(`Documents mapped: ${JSON.stringify(documentsToSendToDatabase)}`);

	// Step 4: Add documents to the database if all are new
	logger.info(`Attempting to insert documents to database...`);

	const { successful, failed } = await attemptInsertDocuments(caseId, documentsToSendToDatabase);
	if (successful.length === 0) {
		logger.info(`Return early because all files failed to upload.`);
		return { response: null, failedDocuments: failed };
	}

	logger.info(`Documents inserted: ${JSON.stringify(successful)}`);

	// Step 5: Map documents to the format expected by the blob storage service
	logger.info(`Mapping documents to blob storage format...`);

	const requestToDocumentStorage = mapDocumentsToSendToBlobStorage(
		successful,
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
		responseFromDocumentStorage.documents,
		responseFromDocumentStorage.privateBlobContainer
	);

	// @ts-ignore
	/**
	 * @type {any[]}
	 */
	const documentActivityLogs = [];
	requestToDocumentStorage.forEach((document) => {
		documentActivityLogs.push(
			documentActivityLogRepository.create({
				documentGuid: document.GUID,
				version: document.version,
				user: documentsToUpload[0].username,
				status: 'uploaded'
			})
		);
	});

	await Promise.all(documentActivityLogs);

	// Step 8: Return the response from the blob storage service, including information about the uploaded documents and their storage location
	logger.info(`Returning response from blob storage service...`);
	return { response: responseFromDocumentStorage, failedDocuments: failed };
};

/**
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number, username: string, documentReference: string}} documentToUpload
 * @param {number} caseId
 * @param {string} documentId
 * @returns {Promise<{blobStorageHost: string, privateBlobContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]}>}}
 */
export const obtainURLForDocumentVersion = async (documentToUpload, caseId, documentId) => {
	// Step 1: Retrieve the case object associated with the provided caseId
	logger.info(`Retrieving case for caseId ${caseId} ${documentId}...`);

	const caseForDocuments = await caseRepository.getById(+caseId, {});

	logger.info(`Case retrieved: ${JSON.stringify(caseForDocuments)}`);

	// Step 2: Check if the case object is found and has a reference
	logger.info(`Checking if case has reference...`);

	if (caseForDocuments == null || caseForDocuments.reference == null) {
		throw new Error('Case not found or has no reference');
	}

	// Step 3: Finding existing document from database
	logger.info(`Finding existing document from database...`);

	const documentFromDatabase = await documentRepository.getByIdWithVersion(documentId);

	if (!documentFromDatabase) {
		throw new Error('Document not found');
	}

	logger.info(`Case has reference`);

	// Step 4: Map documents to the format expected by the database
	logger.info(`Mapping documents to database format...`);

	const documentToSendToDatabase = mapDocumentToSendToDatabase(documentToUpload);

	logger.info(`Document mapped: ${JSON.stringify(documentToSendToDatabase)}`);

	// Step 5: upsert the document to the database

	logger.info(`Document found from database: ${JSON.stringify(documentFromDatabase)}`);

	const fileName = documentName(documentToSendToDatabase.documentName);
	const version = documentFromDatabase.latestVersionId + 1;

	const { documentVersion } = documentFromDatabase;

	const currentDocumentVersion = documentVersion.filter(
		(/** @type {{ version: number; }} */ d) => d.version === documentFromDatabase.latestVersionId
	);

	const isPublishedOldVersion = currentDocumentVersion[0].publishedStatus === 'published';

	// copy all meta data from previous version except below properties.
	currentDocumentVersion[0].version = version;
	currentDocumentVersion[0].fileName = fileName;
	currentDocumentVersion[0].mime = documentToSendToDatabase.documentType;
	currentDocumentVersion[0].size = documentToSendToDatabase.documentSize;
	currentDocumentVersion[0].publishedStatus = 'awaiting_upload';
	currentDocumentVersion[0].redacted = false;
	currentDocumentVersion[0].redactedStatus = '';

	await documentVersionRepository.upsert(currentDocumentVersion[0]);

	const activityLogs = [];
	activityLogs.push(
		// @ts-ignore
		documentActivityLogRepository.create({
			documentGuid: documentId,
			version,
			user: documentToUpload.username,
			status: 'uploaded'
		})
	);

	if (isPublishedOldVersion) {
		activityLogs.push(
			// @ts-ignore
			documentActivityLogRepository.create({
				documentGuid: documentId,
				version: documentFromDatabase.latestVersionId,
				user: documentToUpload.username,
				status: 'unpublished'
			})
		);
	}

	await Promise.all(activityLogs);

	// Step 6: Map documents to the format expected by the blob storage service
	logger.info(`Mapping documents to blob storage format...`);

	const requestToDocumentStorage = [
		{
			caseType: 'application',
			caseReference: caseForDocuments.reference,
			GUID: documentFromDatabase.guid,
			documentName: documentToSendToDatabase.documentName,
			version
		}
	];

	logger.info(`Documents mapped: ${JSON.stringify(requestToDocumentStorage)}`);

	// Step 7: Send a request to the blob storage service to get the storage location for each document

	logger.info(`Sending request to blob storage service...`);

	const responseFromDocumentStorage = await getStorageLocation(requestToDocumentStorage);

	logger.info(`Response from blob storage service: ${JSON.stringify(responseFromDocumentStorage)}`);

	// Step 8: Upsert document versions metadata to the database
	logger.info(`Upserting document versions metadata to database...`);

	await documentVersionRepository.update(documentId, {
		privateBlobContainer: responseFromDocumentStorage.privateBlobContainer,
		version,
		privateBlobPath: responseFromDocumentStorage.documents[0].blobStoreUrl
	});

	await documentRepository.update(documentId, {
		latestVersionId: documentFromDatabase.latestVersionId + 1
	});

	// Step 8: Return the response from the blob storage service, including information about the uploaded documents and their storage location
	logger.info(`Returning response from blob storage service...`);
	return responseFromDocumentStorage;
};
/**
 * Upserts the metadata for a document with the provided GUID using the provided metadata body.
 *
 * @param {string} documentGuid - The GUID of the document to upsert metadata for.
 * @param {DocumentVersion} documentVersionBody - The metadata body to use for upserting.
 * @param {number} version
 * @returns {Promise<DocumentDetails>} A promise that resolves with the document details after the upsert.
 */
export const upsertDocumentVersionAndReturnDetails = async (
	documentGuid,
	documentVersionBody,
	version
) => {
	const documentVersion = await documentVersionRepository.upsert({
		...documentVersionBody,
		documentGuid,
		version
	});

	return mapSingleDocumentDetailsFromVersion(documentVersion);
};

/**
 *
 * @param {string} guid
 * @param {string} status
 * @param {string} redactedStatus
 * @returns {Record<string, any>} An object containing the formatted GUID, and status and redactedStatus.
 */
export const formatDocumentUpdateResponseBody = (guid, status, redactedStatus) => {
	return { guid, status, redactedStatus };
};

/**
 *
 * @param {{documentGuid: string, version: number}[]} documentVersionIds
 * @returns {Promise<{documentGuid: string, publishedStatus: string}[]>}
 */
export const publishNsipDocuments = async (documentVersionIds) => {
	const publishedDocuments = await documentVersionRepository.updateAll(documentVersionIds, {
		publishedStatus: 'publishing',
		publishedStatusPrev: 'ready_to_publish'
	});

	await eventClient.sendEvents(
		NSIP_DOCUMENT,
		publishedDocuments.map(buildNsipDocumentPayload),
		EventType.Update,
		// This is an additional flag which triggers the Azure Function that publishes documents.
		// It essentially means we can create a subscription to this topic with a filter, and saves us from managing a distinct publishing queue
		// It has to be a string because the Terraform module for configuring subscription filters only seems to support string value
		{
			publishing: 'true'
		}
	);

	return documentVersionIds.map(({ documentGuid }) => ({
		documentGuid,
		publishedStatus: 'publishing'
	}));
};

/**
 * @param {{reference: string | null}[]} documents
 * @returns {number}
 */
export const getNextDocumentReferenceIndex = (documents) => {
	if (documents.length === 0) return 1;

	const references = documents.flatMap((d) => {
		if (!d.reference) return [];

		const match = d.reference.match(/-(\d+)/);
		if (!match) return [];

		const index = Number(match[1]);
		if (isNaN(index)) return [];

		return index;
	});

	return Math.max(...references) + 1;
};

/**
 * @param {string} reference
 * @returns {number | null}
 * */
export const getIndexFromReference = (reference) => {
	const match = reference.match(/-(\d+)/);
	if (!match) {
		return null;
	}

	return Number(match[1]);
};

/**
 * @param {string} caseId
 * @param {number} index
 * @returns {string}
 */
export const makeDocumentReference = (caseId, index) =>
	`${caseId}-${index.toString().padStart(6, '0')}`;
