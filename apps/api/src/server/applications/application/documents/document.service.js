import {
	ACCEPTANCE_STAGE_SUBFOLDERS,
	DEFAULT_PAGE_NUMBER,
	DEFAULT_PAGE_SIZE,
	DOCUMENT_TYPES,
	folderDocumentCaseStageMappings,
	SYSTEM_USER_NAME
} from '../../constants.js';
import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import * as caseRepository from '#repositories/case.repository.js';
import { getPageCount, getSkipValue } from '#utils/database-pagination.js';
import { mapDocumentVersionDetails } from '#utils/mapping/map-document-details.js';
import * as documentRepository from '#repositories/document.repository.js';
import * as documentVersionRepository from '#repositories/document-metadata.repository.js';
import * as documentActivityLogRepository from '#repositories/document-activity-log.repository.js';
import { getFolderWithParents, getS51AdviceFolder } from '#repositories/folder.repository.js';
import { getStorageLocation } from '#utils/document-storage.js';
import BackOfficeAppError from '#utils/app-error.js';
import logger from '#utils/logger.js';
import { mapSingleDocumentDetailsFromVersion } from '#utils/mapping/map-document-details.js';
import { EventType } from '@pins/event-client';
import { getFolder, getFolderPath } from '../file-folders/folders.service.js';
import config from '#config/config.js';
import { verifyAllDocumentsHaveRequiredPropertiesForPublishing } from './document.validators.js';
import { applicationStates } from '../../state-machine/application.machine.js';
import { broadcastNsipDocumentEvent } from '#infrastructure/event-broadcasters.js';
import { featureFlagClient } from '#utils/feature-flags.js';
import { getApplicationDocumentsFolderName } from '#utils/mapping/map-document-folder-names.js';
import { handleCreationOfDocumentActivityLogs } from '../../../migration/migrators/nsip-document-migrator.js';

/**
 * @typedef {import('@prisma/client').DocumentVersion} DocumentVersion
 * @typedef {import('@prisma/client').Document} Document
 * @typedef {import('@prisma/client').Document & {documentName: string}} DocumentWithDocumentName
 * @typedef {import('@prisma/client').Prisma.DocumentVersionGetPayload<{include: {Document: {include: {folder: {include: {case: {include: {CaseStatus: true}}}}}}}}> } DocumentVersionWithDocumentAndFolder
 * @typedef {import('@pins/applications.api').Schema.DocumentDetails} DocumentDetails
 * @typedef {import('@pins/applications.api').Schema.DocumentVersionWithDocument} DocumentVersionWithDocument
 * @typedef {import('@pins/applications.api').Api.DocumentAndBlobInfoManyResponse} DocumentAndBlobInfoManyResponse
 * @typedef {import('@pins/applications.api').Api.DocumentAndBlobStorageDetail} DocumentAndBlobStorageDetail
 * @typedef {import('@pins/applications.api').Api.DocumentToSave} DocumentToSave
 * @typedef {import('@pins/applications.api').Api.DocumentToSaveExtended} DocumentToSaveExtended
 * @typedef {import('@pins/applications.api').Api.DocumentBlobStoragePayload} DocumentBlobStoragePayload
 * @typedef {import('@pins/applications.api').Api.PaginatedDocumentDetails} PaginatedDocumentDetails
 */

/**
 * Remove extension from document name
 *
 * @param {string} documentNameWithExtension
 * @returns {string}
 */
export const getFileNameWithoutSuffix = (documentNameWithExtension) => {
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
const mapDocumentsToSendToDatabase = (caseId, documents) =>
	documents?.map((document) => ({
		caseId: caseId.toString(),
		documentName: document.documentName,
		description: document.description,
		descriptionWelsh: document.descriptionWelsh,
		filter1: document.filter1,
		filter1Welsh: document.filter1Welsh,
		folderId: document.folderId,
		documentType: document.documentType,
		documentSize: document.documentSize,
		documentReference: document.documentReference,
		fromFrontOffice: document.fromFrontOffice ?? false,
		fileRowId: document.fileRowId,
		username: document.username,
		author: document.author,
		authorWelsh: document.authorWelsh
	}));

/**
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number, documentReference: string}} document
 * @returns {{documentName: string, folderId: number; documentType: string, documentSize: number, documentReference: string}}
 */
const mapDocumentToSendToDatabase = (document) => {
	// TODO: Why are we duplicating this, why are the parameters different and why aren't we setting the caseId??
	return {
		documentName: document.documentName,
		folderId: document.folderId,
		documentType: document.documentType,
		documentSize: document.documentSize,
		documentReference: document.documentReference
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
 * @param {boolean} isS51
 * @returns {Promise<{successful: DocumentWithDocumentName[], failed: string[]}>}
 */
const attemptInsertDocuments = async (caseId, documents, isS51) => {
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
			const fileName = getFileNameWithoutSuffix(documentToDB.documentName);

			logger.info(`Inserting document to database: ${documentToDB}`);

			let document;
			try {
				document = await documentRepository.create({
					caseId,
					folderId: documentToDB.folderId,
					documentReference: documentToDB.documentReference,
					fromFrontOffice: documentToDB.fromFrontOffice,
					documentType: isS51 ? DOCUMENT_TYPES.S51Attachment : DOCUMENT_TYPES.Document
				});
			} catch (err) {
				logger.error(err);
				failed.add(documentToDB.documentName);
				return;
			}

			logger.info(`Inserted document with guid: ${document.guid}`);

			// Get the cases stage to be applied to the document based on the folder
			let stage = await getCaseStageMapping(documentToDB.folderId);

			logger.info(`Upserting metadata for document with guid: ${document.guid}`);
			await documentVersionRepository.upsert({
				documentGuid: document.guid,
				fileName,
				originalFilename: documentToDB.documentName,
				description: documentToDB.description,
				descriptionWelsh: documentToDB.descriptionWelsh,
				filter1: documentToDB.filter1,
				filter1Welsh: documentToDB.filter1Welsh,
				mime: documentToDB.documentType,
				size: documentToDB.documentSize,
				owner: documentToDB.username,
				author: documentToDB.author,
				authorWelsh: documentToDB.authorWelsh,
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
const mapDocumentsToGetBlobStorageProperties = (documents, caseReference) => {
	return documents.map((document) => {
		return {
			caseType: 'application',
			caseReference,
			GUID: document.guid,
			documentName: document.documentName,
			documentReference: document?.documentReference,
			version: 1
		};
	});
};

/**
 * Upserts metadata for a set of documents to a database.
 *
 * @param {DocumentAndBlobStorageDetail[]} blobStorageDocuments - Array of documents containing metadata to upsert.
 * @param {string} privateBlobContainer - Name of the blob storage container where documents are stored.
 * @returns {Promise<DocumentVersionWithDocumentAndFolder[]>}
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
	const upsertedDocumentsResponse = await PromisePool.withConcurrency(5)
		.for(documentsMetadataToSendToDatabase)
		.handleError((error) => {
			// Log any errors that occur during the upsert process and re-throw the error.
			logger.error(`Error while upserting documents to database: ${error}`);
			throw error;
		})
		.process(async (metadata) => {
			// Log the metadata being upserted for debugging purposes
			logger.info(`Upserting document metadata: ${JSON.stringify(metadata)}`);

			// Upsert the metadata using the documentVersionRepository
			return documentVersionRepository.upsert(metadata);
		});
	return upsertedDocumentsResponse.results;
};

/**
 * creates document, document version, and activity log records for an array of new documents on a case
 *
 * @param {DocumentToSaveExtended[]} documentsToUpload
 * @param {number} caseId
 * @param {boolean} [isS51]
 * @returns {Promise<{response: DocumentAndBlobInfoManyResponse | null, failedDocuments: string[]}>}}
 */
export const createDocuments = async (documentsToUpload, caseId, isS51) => {
	// Step 1: Retrieve the case object associated with the provided caseId
	logger.info(`Retrieving case for caseId ${caseId}...`);
	const caseForDocuments = await caseRepository.getById(Number(caseId), { sector: true });
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
	logger.info(`Documents mapped: ${JSON.stringify(documentsToSendToDatabase)}`);

	// Step 4: Add documents to the database if all are new
	logger.info(`Attempting to insert documents to database...`);
	const { successful, failed } = await attemptInsertDocuments(
		caseId,
		documentsToSendToDatabase,
		isS51 ?? false
	);
	if (successful.length === 0) {
		logger.info(`Return early because all files failed to upload.`);
		return { response: null, failedDocuments: failed };
	}
	logger.info(`Documents inserted: ${JSON.stringify(successful)}`);

	// Step 5: Map documents to the format expected to get blob storage properties
	logger.info(`Mapping documents to blob storage format...`);
	const requestToGetDocumentStorageProperties = mapDocumentsToGetBlobStorageProperties(
		successful,
		caseForDocuments.reference
	);
	logger.info(`Documents mapped: ${JSON.stringify(requestToGetDocumentStorageProperties)}`);

	// Step 6: generate the blob storage service properties
	const documentsWithBlobStorageInfo = await getStorageLocation(
		requestToGetDocumentStorageProperties
	);
	logger.info(
		`Documents with Blob storage service properties: ${JSON.stringify(
			documentsWithBlobStorageInfo
		)}`
	);

	// Step 7: Upsert document versions metadata to the database
	logger.info(`Upserting document versions metadata to database...`);
	const upsertedDocuments = await upsertDocumentVersionsMetadataToDatabase(
		documentsWithBlobStorageInfo.documents,
		documentsWithBlobStorageInfo.privateBlobContainer
	);

	/** @type {Promise<import('@prisma/client').DocumentActivityLog>[]} */
	// TODO: refactor to use createMany instead?
	const documentActivityLogs = requestToGetDocumentStorageProperties.map((document) =>
		documentActivityLogRepository.create({
			documentGuid: document.GUID,
			version: document.version,
			user: documentsToUpload[0].username,
			status: 'uploaded'
		})
	);

	await Promise.all(documentActivityLogs);

	// now send broadcast events for doc creations - ignoring docs on training cases.
	await broadcastNsipDocumentEvent(upsertedDocuments, EventType.Create);

	// Step 8: Return information about the uploaded documents and their storage location
	logger.info(`Returning created and failed documents with blob storage properties...`);
	return { response: documentsWithBlobStorageInfo, failedDocuments: failed };
};

/**
 * creates a new document version on a document, creating doc version records, activity log records, updating Document latest version, and broadcast event
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number, username: string, documentReference: string}} documentToUpload
 * @param {number} caseId
 * @param {string} documentId
 * @param {boolean} isMigrationPublish
 * @returns {Promise<DocumentAndBlobInfoManyResponse>}}
 */
export const createDocumentVersion = async (
	documentToUpload,
	caseId,
	documentId,
	isMigrationPublish = false
) => {
	// Step 1: Retrieve the case object associated with the provided caseId
	logger.info(`Retrieving case for caseId ${caseId} ${documentId}...`);
	const caseForDocuments = await caseRepository.getById(caseId, { sector: true });
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

	// Step 4: Map document to the format expected by the database
	logger.info(`Mapping document to database format...`);
	const documentToSendToDatabase = mapDocumentToSendToDatabase(documentToUpload);
	logger.info(`Document mapped: ${JSON.stringify(documentToSendToDatabase)}`);

	// Step 5: upsert the document to the database
	logger.info(`Document found from database: ${JSON.stringify(documentFromDatabase)}`);
	const fileName = getFileNameWithoutSuffix(documentToSendToDatabase.documentName);
	const version = (documentFromDatabase.latestVersionId ?? 0) + 1;

	const { documentVersion } = documentFromDatabase;

	const newDocumentVersion = documentVersion.filter(
		(/** @type {{ version: number; }} */ d) => d.version === documentFromDatabase.latestVersionId
	)[0];

	const previousDocumentVersion = documentFromDatabase.documentVersion.pop();
	// copy all meta data from previous version except below properties.
	newDocumentVersion.version = version;
	newDocumentVersion.mime = documentToSendToDatabase.documentType;
	newDocumentVersion.fileName = previousDocumentVersion?.fileName ?? fileName;
	newDocumentVersion.size = documentToSendToDatabase.documentSize;
	newDocumentVersion.owner = documentToUpload.username;
	newDocumentVersion.originalFilename = documentToUpload.documentName;
	newDocumentVersion.datePublished = isMigrationPublish
		? previousDocumentVersion.publishedDate
		: null;
	newDocumentVersion.publishedBlobPath = null;
	newDocumentVersion.publishedBlobContainer = null;
	newDocumentVersion.publishedStatusPrev = null;
	newDocumentVersion.redactedStatus = null;

	await documentVersionRepository.upsert(newDocumentVersion);

	if (isMigrationPublish) {
		await handleCreationOfDocumentActivityLogs(newDocumentVersion);
	} else {
		await documentActivityLogRepository.create({
			documentGuid: documentId,
			version,
			user: documentToUpload.username,
			status: 'uploaded'
		});
	}

	// Step 6: Map document to the format expected to get blob storage properties
	logger.info(`Mapping document to blob storage format...`);
	const requestToGetDocumentStorageProperties = [
		{
			/** @type {'appeal' | 'application'} */ caseType: 'application',
			caseReference: caseForDocuments.reference,
			GUID: documentFromDatabase.guid,
			documentName: documentToSendToDatabase.documentName,
			version
		}
	];
	logger.info(`Documents mapped: ${JSON.stringify(requestToGetDocumentStorageProperties)}`);

	// Step 7: generate the blob storage service properties
	logger.info(`Generate the blob storage properties...`);
	const documentWithBlobStorageInfo = await getStorageLocation(
		requestToGetDocumentStorageProperties
	);
	logger.info(
		`Documents with Blob storage service properties: ${JSON.stringify(documentWithBlobStorageInfo)}`
	);

	// Step 8: Upsert document version metadata to the database
	logger.info(`Upserting document version metadata to database...`);

	let createdVersionWithDocInfo = await documentVersionRepository.update(documentId, {
		privateBlobContainer: documentWithBlobStorageInfo.privateBlobContainer,
		version,
		// @ts-ignore
		// MigrationAddition: this null check is for the transformation of migrated html documents,
		privateBlobPath:
			documentToUpload.privateBlobPath ?? documentWithBlobStorageInfo.documents[0].blobStoreUrl
	});

	const thisVersionId = (documentFromDatabase.latestVersionId ?? 0) + 1;
	await documentRepository.update(documentId, {
		latestVersionId: thisVersionId
	});

	// 1st fix the doc latestversionId in the payload to match (saves having to get the whole doc+version again after the doc update)
	// @ts-ignore
	createdVersionWithDocInfo.Document.latestVersionId = thisVersionId;

	// broadcast event - ignoring if doc is on non Training cases
	if (isMigrationPublish) {
		await broadcastNsipDocumentEvent(createdVersionWithDocInfo, EventType.Update, {
			publishing: 'true',
			migrationPublishing: 'true'
		});
	} else {
		await broadcastNsipDocumentEvent(createdVersionWithDocInfo, EventType.Update);
	}

	// Step 8: Return information about the uploaded document version and its storage location
	logger.info(`Returning updated document with blob storage properties...`);
	return documentWithBlobStorageInfo;
};

/**
 * Upserts the metadata for a document with the provided GUID using the provided metadata body.
 *
 * @param {string} caseId - The case id this document is in
 * @param {string} documentGuid - The GUID of the document to upsert metadata for.
 * @param {DocumentVersion} documentVersionBody - The metadata body to use for upserting.
 * @param {number} version
 * @returns {Promise<DocumentDetails>} A promise that resolves with the document details after the upsert.
 */
export const upsertDocumentVersionAndReturnDetails = async (
	caseId,
	documentGuid,
	documentVersionBody,
	version
) => {
	const documentVersion = await documentVersionRepository.upsert({
		...documentVersionBody,
		documentGuid,
		version
	});

	// broadcast event - ignoring if doc is on non Training cases
	await broadcastNsipDocumentEvent(documentVersion, EventType.Update);

	// @ts-ignore
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
 * returns all the published versions for the array of document guids passed
 *
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
 * Checks an array of doc guids is valid for publishing and publishes those documents,
 * returning arrays of successful and failed.
 * Fn also used for S51 Advice documents (skipRequiredPropertyChecks = true )
 *
 * @param {string[]} documentGuids
 * @param {string} username
 * @param {boolean} skipRequiredPropertyChecks	// set to true for S51 Advice attachments
 * @returns {Promise<{ successful: string[], failed: {guid: string, msg: string}[] }>}
 * */
export const publishDocuments = async (
	documentGuids,
	username,
	skipRequiredPropertyChecks = false
) => {
	const { publishable: publishableDocumentVersionIds, invalid } =
		await verifyAllDocumentsHaveRequiredPropertiesForPublishing(
			documentGuids,
			skipRequiredPropertyChecks
		);

	const activityLogs = publishableDocumentVersionIds.map((document) =>
		documentActivityLogRepository.create({
			documentGuid: document.documentGuid,
			version: document.version,
			user: username,
			status: 'published'
		})
	);

	await Promise.all(activityLogs);

	// only publish docs if there are any that are verified as publishable
	/** @type {string[]} */
	let successfulPublishedDocGuids = [];

	if (publishableDocumentVersionIds.length > 0) {
		const publishedDocuments = await publishDocumentVersions(publishableDocumentVersionIds);
		logger.info(`Published ${publishedDocuments.length} documents`);
		successfulPublishedDocGuids = publishedDocuments.map((d) => d.documentGuid);
	}

	return {
		successful: successfulPublishedDocGuids,
		failed: invalid
	};
};

/**
 * publishes an array of documents, publishing the latest version.
 * If there are any published older versions, these are auto unpublished too
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
	const publishedDocuments = await documentVersionRepository.publishMany(documentVersionIds);

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

	// unpublish all the old published versions
	await Promise.all(
		unpublishedDocuments.map((doc) =>
			documentActivityLogRepository.create({
				documentGuid: doc.documentGuid,
				version: doc.version,
				user: SYSTEM_USER_NAME,
				status: 'unpublished'
			})
		)
	);

	// broadcast event - ignoring if doc is on non Training cases
	// There is an additional flag which triggers the Azure Function that publishes documents.
	// It essentially means we can create a subscription to this topic with a filter, and saves us from managing a distinct publishing queue
	// It has to be a string because the Terraform module for configuring subscription filters only seems to support string value
	await broadcastNsipDocumentEvent(publishedDocuments, EventType.Update, { publishing: 'true' });

	return publishedDocuments;
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
 * @param {{displayNameEn: string, id: number}[]} folderPath
 * @returns {boolean}
 */
export const isFolderApplicationDocuments = (folderPath) => {
	const requiredNames = [
		folderDocumentCaseStageMappings.ACCEPTANCE, //Acceptance
		ACCEPTANCE_STAGE_SUBFOLDERS.APPLICATION_DOCUMENTS //Application Documents
	];
	const displayNames = folderPath.map((folder) => folder.displayNameEn);

	return requiredNames.every((name) => displayNames.includes(name));
};

/**
 *
 * @param {{displayNameEn: string, id: number}[]} folderPath
 * @returns {{cy: string, en: string}}
 */
export const getApplicationDocumentWebfilter = (folderPath) => {
	const folderName = folderPath[2]?.displayNameEn;
	const defaultWebfilter = {
		cy: '',
		en: ''
	};

	return getApplicationDocumentsFolderName(folderName) ?? defaultWebfilter;
};

/**
 *
 * @param {object} applicantData
 * @returns {{cy: string, en: string}}
 */
const getApplicationDocumentAuthor = (applicantData) => {
	return {
		en: applicantData?.organisationName || '',
		cy: applicantData?.organisationName || ''
	};
};

/**
 * @param {object} caseData
 * @param {number} folderId
 * @returns {Promise<{webfilter: {en: string, cy: string} | undefined, author: {en: string, cy: string}|undefined} | {}>}
 * */
export const getDocumentMetadataByFolderName = async (caseData, folderId) => {
	const caseId = caseData.id;
	const applicantData = caseData.applicant;
	const folderPath = await getFolderPath(caseId, folderId);

	let documentMetadata = {};
	if (!folderPath) return documentMetadata; //error out here instead

	const isApplicationDocumentsFolder = isFolderApplicationDocuments(folderPath);

	if (isApplicationDocumentsFolder) {
		documentMetadata.webfilter = getApplicationDocumentWebfilter(folderPath);
		documentMetadata.author = getApplicationDocumentAuthor(applicantData);

		return documentMetadata;
	}

	//return empty default
	return documentMetadata;
};

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

	// broadcast event - ignoring if doc is on non Training cases
	await broadcastNsipDocumentEvent(publishedDocument, EventType.Publish);

	return publishedDocument;
};

/**
 *
 * @param {{guid: string, version: number}} documents
 * @returns {Promise<DocumentVersion>}
 */
export const markDocumentVersionAsUnpublished = async ({ guid, version }) => {
	const publishedDocument = await documentVersionRepository.update(guid, {
		version,
		publishedStatus: 'unpublished',
		publishedStatusPrev: 'unpublishing'
	});

	// broadcast event - ignoring if doc is on non Training cases
	await broadcastNsipDocumentEvent(publishedDocument, EventType.Unpublish);

	return publishedDocument;
};

/**
 * Given a list of file names, return three lists: one of pre-existing files with that name in the folder, one of deleted files with that name in the folder, and one with the remainder
 *
 * @typedef {{ duplicates: string[], deleted: string[], remainder: string[] }} ExtractedDuplicates
 * @param {DocumentToSave[]} documents
 * @returns {Promise<ExtractedDuplicates>}
 * */
export const extractDuplicatesAndDeleted = async (documents) => {
	const results = await Promise.allSettled(
		documents.map(
			({ folderId, documentName, fromFrontOffice }) =>
				new Promise((resolve, reject) => {
					if (featureFlagClient.isFeatureActive('applics-861-fo-submissions')) {
						if (fromFrontOffice) {
							// Allow duplicates from the front office
							return resolve(documentName);
						}
					}
					return documentRepository
						.getInFolderByName(folderId, documentName, true)
						.then((existing) => {
							if (existing) {
								reject({ documentName, isDeleted: existing.isDeleted });
							} else {
								resolve(documentName);
							}
						});
				})
		)
	);

	return results.reduce((acc, result) => {
		if (result.status === 'fulfilled') {
			acc.remainder.push(result.value);
		} else if (result.reason.isDeleted) {
			acc.deleted.push(result.reason.documentName);
		} else {
			acc.duplicates.push(result.reason.documentName);
		}

		return acc;
	}, /** @type {ExtractedDuplicates} */ ({ duplicates: [], deleted: [], remainder: [] }));
};

/**
 * @param {string[]} guids
 * @return {Promise<{ publishableIds: string[], errors: { guid: string, msg: string }[] }>}
 * */
export const separatePublishableDocuments = async (guids) => {
	const { publishable, invalid } = await verifyAllDocumentsHaveRequiredPropertiesForPublishing(
		guids,
		false
	);

	return {
		publishableIds: publishable.map((p) => p.documentGuid),
		errors: invalid
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
export const handleUpdateDocuments = async (guids, publishedStatus, redactedStatus) => {
	/** @type {ItemError[]} */
	let errors = [];

	/** @type {Record<string, any>[]} */
	let results = [];

	let updatedDocuments = [];

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
		updatedDocuments.push(updateResponseInTable);

		const formattedResponse = formatDocumentUpdateResponseBody(
			updateResponseInTable.documentGuid ?? '',
			updateResponseInTable.publishedStatus ?? '',
			updateResponseInTable.redactedStatus ?? ''
		);

		results.push(formattedResponse);
	}

	// broadcast event for each of the updated documents - ignoring if doc is on non Training cases
	await broadcastNsipDocumentEvent(updatedDocuments, EventType.Update);

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
 * @returns {Promise<string[]>} // array of unpublished doc guids
 * */
export const unpublishDocuments = async (guids) => {
	const versionPromises = guids.map(documentVersionRepository.getPublished);
	const versions = await Promise.all(versionPromises);

	const allVersions = versions.flatMap((docVersions) => docVersions?.filter(Boolean) ?? []);

	const unpublishedDocuments = await documentVersionRepository.unpublishMany(
		allVersions.map((version) => ({
			documentGuid: version.documentGuid,
			version: version.version
		}))
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

	// broadcast event for each of the unpublished documents - ignoring if doc is on non Training cases
	await broadcastNsipDocumentEvent(unpublishedDocuments, EventType.Update, {
		unpublishing: 'true'
	});

	return unpublishedDocuments.map((doc) => doc.documentGuid);
};

/**
 * Returns paginated array of documents in a folder on a case, excluding S51 Advice docs
 *
 * @param {number} caseId
 * @param {string} criteria
 * @param {number} pageNumber
 * @param {number} pageSize
 * @returns {Promise<PaginatedDocumentDetails>}
 */
export const getDocumentsInCase = async (
	caseId,
	criteria,
	pageNumber = DEFAULT_PAGE_NUMBER,
	pageSize = DEFAULT_PAGE_SIZE
) => {
	const skipValue = getSkipValue(pageNumber, pageSize);

	// need to exclude all S51 Advice docs.  If there are any, they are in the top level folder for S51 advice
	const s51AdviceFolder = await getS51AdviceFolder(caseId);
	const documentsCount = await documentRepository.getDocumentsCountInCase(
		caseId,
		criteria,
		s51AdviceFolder?.id
	);
	const documents = await documentRepository.getDocumentsInCase(
		caseId,
		criteria,
		s51AdviceFolder?.id,
		skipValue,
		pageSize
	);

	// @ts-ignore
	const mapDocument = documents.map(({ documentVersion, ...Document }) => ({
		Document,
		...documentVersion[documentVersion.length - 1]
	}));

	return {
		page: pageNumber,
		pageDefaultSize: pageSize,
		pageCount: getPageCount(documentsCount, pageSize),
		itemCount: documentsCount,
		items: mapDocumentVersionDetails(mapDocument)
	};
};

/**
 * Updates the documents folderId and stage to 'move' document to another folder
 * @param   {{documents: {documentGuid: string, fileName: string, version: number}[], destinationFolderId: number, destinationFolderStage: string}} payload
 * @returns {Promise<Record<string, any>>}
 */

export const updateDocumentsFolderId = async (payload) => {
	try {
		return await documentRepository.updateDocumentsFolderId(payload);
	} catch (error) {
		logger.error(`Failed to update documents folder id: ${error}`);
		return {
			errors: {
				msg: 'One or more of your documents cannot be moved'
			}
		};
	}
};

/**
 * soft deletes a document
 *
 * @param {string} guid
 * @param {string} caseId
 * @throws {BackOfficeAppError} If the document is published, or if the document cannot be deleted for any other reason.
 * @returns {Promise<Document>}
 * */
export const deleteDocument = async (guid, caseId) => {
	// Step 1: Fetch the document to be deleted from the database
	const documentToDelete = await documentVersionRepository.getById(guid);

	if (documentToDelete === null || typeof documentToDelete === 'undefined') {
		throw new BackOfficeAppError(
			`document not found: guid ${guid} related to caseId ${caseId}`,
			404
		);
	}

	// Step 2: Check if the document is published; if so, throw an error as it cannot be deleted
	const documentIsPublished =
		documentToDelete.publishedStatus?.toLowerCase() === applicationStates.published?.toLowerCase();

	if (documentIsPublished) {
		throw new BackOfficeAppError(
			`unable to delete document guid ${guid} related to caseId ${caseId}`,
			400
		);
	}

	// step 3: mark the document as deleted
	const deletedDocument = await documentRepository.deleteDocument(guid);

	// Step 4: broadcast event message - ignoring training cases
	await broadcastNsipDocumentEvent(documentToDelete, EventType.Delete);

	return deletedDocument;
};

/**
 * reverts a document status to its previous status - eg ready_to_publish back to not_checked
 *
 * @param {string} guid
 * @param {string} newPublishedStatus
 * @param {string |null} newPublishedStatusPrev
 * @returns {Promise<DocumentVersionWithDocument>}
 * */
export const revertDocumentStatusToPrevious = async (
	guid,
	newPublishedStatus,
	newPublishedStatusPrev
) => {
	const updatedDocument = await documentVersionRepository.update(guid, {
		publishedStatus: newPublishedStatus,
		publishedStatusPrev: newPublishedStatusPrev
	});

	// broadcast event message - ignore training cases
	await broadcastNsipDocumentEvent(updatedDocument, EventType.Update);

	return updatedDocument;
};

/**
 *
 * @param {number} folderId
 * @param {string |null} caseRef
 * @param {string} filename
 * @returns {Promise<string>}
 */
export const buildDocumentFolderPath = async (folderId, caseRef, filename) => {
	let parentFolders = await getFolderWithParents(folderId);
	let folderPath = `${caseRef}`;

	// tree is traversed in order, we want it reversed
	if (parentFolders) {
		parentFolders = parentFolders.reverse();
	}
	for (const aFolder of parentFolders) {
		folderPath = folderPath + '/' + aFolder.displayNameEn;
	}
	folderPath = `${folderPath}/${filename}`;

	return folderPath;
};
