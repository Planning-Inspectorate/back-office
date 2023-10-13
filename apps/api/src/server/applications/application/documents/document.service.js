import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import * as caseRepository from '#repositories/case.repository.js';
import * as documentRepository from '#repositories/document.repository.js';
import * as documentVersionRepository from '#repositories/document-metadata.repository.js';
import * as documentActivityLogRepository from '#repositories/document-activity-log.repository.js';
import { getStorageLocation } from '#utils/document-storage.js';
import BackOfficeAppError from '#utils/app-error.js';
import logger from '#utils/logger.js';
import { mapSingleDocumentDetailsFromVersion } from '#utils/mapping/map-document-details.js';
import { eventClient } from '#infrastructure/event-client.js';
import { buildNsipDocumentPayload } from './document.js';
import { NSIP_DOCUMENT } from '#infrastructure/topics.js';
import { EventType } from '@pins/event-client';
import { getFolder } from '../file-folders/folders.service.js';
import config from '#config/config.js';
import { verifyAllDocumentsHaveRequiredPropertiesForPublishing } from './document.validators.js';

/**
 * @typedef {import('@prisma/client').DocumentVersion} DocumentVersion
 * @typedef {import('@prisma/client').Document} Document
 * @typedef {import('@prisma/client').Document & {documentName: string}} DocumentWithDocumentName
 * @typedef {import('@pins/applications.api').Schema.DocumentDetails} DocumentDetails
 * @typedef {import('@pins/applications.api').Api.DocumentAndBlobInfoManyResponse} DocumentAndBlobInfoManyResponse
 * @typedef {import('@pins/applications.api').Api.DocumentAndBlobStorageDetail} DocumentAndBlobStorageDetail
 * @typedef {import('@pins/applications.api').Api.DocumentToSave} DocumentToSave
 * @typedef {import('@pins/applications.api').Api.DocumentToSaveExtended} DocumentToSaveExtended
 * @typedef {import('@pins/applications.api').Api.DocumentBlobStoragePayload} DocumentBlobStoragePayload
 */

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
 * @param {DocumentToSaveExtended[]} documents
 * @returns {DocumentToSaveExtended[]}
 */
const mapDocumentsToSendToDatabase = (caseId, documents) => {
	return documents?.map((document) => {
		return {
			caseId: caseId.toString(),
			documentName: document.documentName,
			folderId: document.folderId,
			documentType: document.documentType,
			documentSize: document.documentSize,
			documentReference: document.documentReference,
			fromFrontOffice: document.fromFrontOffice ?? false,
			fileRowId: document.fileRowId,
			username: document.username
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
 * @param {DocumentToSaveExtended[]} documents
 * @returns {Promise<{successful: DocumentWithDocumentName[], failed: string[]}>}
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
					reference: documentToDB.documentReference,
					fromFrontOffice: documentToDB.fromFrontOffice
				});
			} catch (err) {
				logger.error(err);
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
				version: 1,
				...(config.virusScanningDisabled && {
					publishedStatus: 'not_checked'
				})
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

	const successful = /** @type { DocumentWithDocumentName[] } */ (results.filter(Boolean));

	return { successful, failed: Array.from(failed) };
};

/**
 * @param {DocumentWithDocumentName[]} documents
 * @param {string} caseReference
 * @returns {DocumentBlobStoragePayload[]}
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
 * @param {DocumentAndBlobStorageDetail[]} blobStorageDocuments - Array of documents containing metadata to upsert.
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
 * @param {DocumentToSaveExtended[]} documentsToUpload
 * @param {number} caseId
 * @returns {Promise<{response: DocumentAndBlobInfoManyResponse | null, failedDocuments: string[]}>}}
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

	/** @type {Promise<import('@prisma/client').DocumentActivityLog>[]} */
	const documentActivityLogs = [];
	// TODO: refactor to use createMany instead?
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
 * Used when uploading a new document version
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number, username: string, documentReference: string}} documentToUpload
 * @param {number} caseId
 * @param {string} documentId
 * @returns {Promise<DocumentAndBlobInfoManyResponse>}}
 */
export const obtainURLForDocumentVersion = async (documentToUpload, caseId, documentId) => {
	// Step 1: Retrieve the case object associated with the provided caseId
	logger.info(`Retrieving case for caseId ${caseId} ${documentId}...`);

	const caseForDocuments = await caseRepository.getById(caseId, {});

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

	// copy all meta data from previous version except below properties.
	currentDocumentVersion[0].version = version;
	currentDocumentVersion[0].fileName = fileName;
	currentDocumentVersion[0].mime = documentToSendToDatabase.documentType;
	currentDocumentVersion[0].size = documentToSendToDatabase.documentSize;

	await documentVersionRepository.upsert(currentDocumentVersion[0]);

	await documentActivityLogRepository.create({
		documentGuid: documentId,
		version,
		user: documentToUpload.username,
		status: 'uploaded'
	});

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
 * @param {string[]} documentGuids
 * @returns {Promise<import('@pins/applications.api').Schema.DocumentVersion[]>}
 * */
export const getCurrentlyPublished = async (documentGuids) => {
	const promises = documentGuids.map(documentVersionRepository.getPublished);
	const results = await Promise.all(promises);
	if (!results) {
		throw new BackOfficeAppError('failed to fetch currently published documents', 500);
	}

	return results.flatMap((result) => result ?? []);
};

/**
 *
 * @param {{documentGuid: string, version: number}[]} documentVersionIds
 * @returns {Promise<import('@pins/applications.api').Schema.DocumentVersionWithDocument[]>}
 */
export const publishDocumentVersions = async (documentVersionIds) => {
	/** @type {string[]} */
	const documentGuids = documentVersionIds.reduce((acc, version) => {
		if (acc.includes(version.documentGuid)) {
			return acc;
		}

		return [...acc, version.documentGuid];
	}, /** @type {string[]} */ ([]));

	const currentlyPublished = await getCurrentlyPublished(documentGuids);

	const publishedDocuments = await documentVersionRepository.updateAll(documentVersionIds, {
		publishedStatus: 'publishing',
		publishedStatusPrev: 'ready_to_publish'
	});

	const unpublishedDocuments = await documentVersionRepository.updateAll(
		currentlyPublished.map((version) => ({
			documentGuid: version.documentGuid,
			version: version.version
		})),
		{
			publishedStatus: 'unpublished',
			publishedStatusPrev: 'published'
		}
	);

	await Promise.all(
		unpublishedDocuments.map((doc) =>
			documentActivityLogRepository.create({
				documentGuid: doc.documentGuid,
				version: doc.version,
				user: doc.owner,
				status: 'unpublished'
			})
		)
	);

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

	return publishedDocuments;
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

/**
 *
 * @param {{guid: string, version: number, publishedBlobPath: string, publishedBlobContainer: string, publishedDate: Date}} documents
 * @returns {Promise<DocumentVersion>}
 */
export const markDocumentVersionAsPublished = async ({
	guid,
	version,
	publishedBlobPath,
	publishedBlobContainer,
	publishedDate
}) => {
	const publishedDocument = await documentVersionRepository.update(guid, {
		version,
		publishedBlobPath,
		publishedBlobContainer,
		datePublished: publishedDate,
		publishedStatus: 'published',
		publishedStatusPrev: 'publishing'
	});

	await eventClient.sendEvents(
		NSIP_DOCUMENT,
		[buildNsipDocumentPayload(publishedDocument)],
		EventType.Publish
	);

	return publishedDocument;
};

/**
 * Given a list of file names, return two lists: one of pre-existing files with that name in the folder, and another with the remainder
 *
 * @typedef {{ duplicates: string[], remainder: string[] }} ExtractedDuplicates
 * @param {DocumentToSave[]} documents
 * @returns {Promise<ExtractedDuplicates>}
 * */
export const extractDuplicates = async (documents) => {
	const results = await Promise.allSettled(
		documents.map(
			(doc) =>
				new Promise((resolve, reject) =>
					documentRepository
						.getInFolderByName(doc.folderId, doc.documentName, true)
						.then((existing) => {
							if (existing) {
								reject(doc.documentName);
							} else {
								resolve(doc.documentName);
							}
						})
				)
		)
	);

	return results.reduce((acc, result) => {
		if (result.status === 'fulfilled') {
			acc.remainder.push(result.value);
		} else {
			acc.duplicates.push(result.reason);
		}

		return acc;
	}, /** @type {ExtractedDuplicates} */ ({ duplicates: [], remainder: [] }));
};

/**
 * @param {string[]} guids
 * @return {Promise<{ publishableIds: string[], errors: { guid: string, msg: string }[] }>}
 * */
export const separatePublishableDocuments = async (guids) => {
	const { publishable, invalid } = await verifyAllDocumentsHaveRequiredPropertiesForPublishing(
		guids
	);

	return {
		publishableIds: publishable.map((p) => p.documentGuid),
		errors: invalid.map((id) => ({
			guid: id,
			msg: 'You must fill in all mandatory document properties to publish a document'
		}))
	};
};

/**
 * Executes a list of updates to document publishedStatus and redacted status.
 * Also handles implicit logic around publishedStatus/publishedStatusPrev.
 *
 * @typedef {{ guid: string, msg: string }} ItemError
 *
 * @param {string[]} guids
 * @param {string} [publishedStatus]
 * @param {'redacted' | 'not_redacted'} [redactedStatus]
 * @returns {Promise<{ errors: ItemError[], results: Record<string, any>[] }>}
 * */
export const handleUpdateDocument = async (guids, publishedStatus, redactedStatus) => {
	/** @type {ItemError[]} */
	let errors = [];

	/** @type {Record<string, any>[]} */
	let results = [];

	for (const guid of guids) {
		logger.info(
			`Updating document with guid: ${guid} to published status: ${publishedStatus} and redacted status: ${redactedStatus}`
		);

		// TODO: Let's refactor this so that the front-end provides the explicitly verson numbers
		// @ts-ignore
		const { latestDocumentVersion: documentVersion } = await documentRepository.getByDocumentGUID(
			guid
		);

		if (publishedStatus && documentVersion.publishedStatus === 'published') {
			errors.push({
				guid,
				msg: 'You must first unpublish the document before changing the status.'
			});

			continue;
		}

		/**
		 * @typedef {object} Updates
		 * @property {string} [publishedStatus]
		 * @property {string} [publishedStatusPrev]
		 * @property {string} [redactedStatus]
		 */

		/** @type {Updates} */
		const documentVersionUpdates = {
			publishedStatus,
			redactedStatus
		};

		if (!publishedStatus) {
			delete documentVersionUpdates.publishedStatus;
		} else if (
			documentVersion?.publishedStatus !== undefined &&
			documentVersion.publishedStatus !== publishedStatus
		) {
			documentVersionUpdates.publishedStatusPrev = documentVersion.publishedStatus;
		}

		const updateResponseInTable = await documentVersionRepository.update(guid, {
			version: documentVersion.version,
			...documentVersionUpdates
		});

		const formattedResponse = formatDocumentUpdateResponseBody(
			updateResponseInTable.documentGuid ?? '',
			updateResponseInTable.publishedStatus ?? '',
			updateResponseInTable.redactedStatus ?? ''
		);

		results.push(formattedResponse);
	}

	return { errors, results };
};

/**
 * Return document GUIDs (and their statuses) which are not published
 *
 * @param {string[]} guids
 * @returns {Promise<string[]>}
 * */
export const separateNonPublishedDocuments = async (guids) => {
	/** @type {string[]} */
	let results = [];

	for (const guid of guids) {
		const documentFromDatabase = await documentRepository.getByIdWithVersion(guid);

		if (
			!documentFromDatabase.documentVersion.some(
				(/** @type {DocumentVersion} */ version) => version.publishedStatus === 'published'
			)
		) {
			results.push(guid);
		}
	}

	return results;
};

/**
 * Unpublish a list of documents
 *
 * @param {string[]} guids
 * @returns {Promise<string[]>}
 * */
export const unpublishDocuments = async (guids) => {
	const versionPromises = guids.map(documentVersionRepository.getPublished);
	const versions = await Promise.all(versionPromises);

	const allVersions = versions.flatMap((docVersions) => docVersions?.filter(Boolean) ?? []);

	const unpublishedDocuments = await documentVersionRepository.updateAll(
		allVersions.map((version) => ({
			documentGuid: version.documentGuid,
			version: version.version
		})),
		{
			publishedStatus: 'unpublished',
			publishedStatusPrev: 'published'
		}
	);

	await Promise.all(
		allVersions.map((version) =>
			documentActivityLogRepository.create({
				documentGuid: version.documentGuid,
				version: version.version,
				user: version.owner ?? '',
				status: 'unpublished'
			})
		)
	);

	return unpublishedDocuments.map((doc) => doc.documentGuid);
};
