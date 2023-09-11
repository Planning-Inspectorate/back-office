import { pick } from 'lodash-es';
import * as caseRepository from '../../../repositories/case.repository.js';
import * as documentRepository from '../../../repositories/document.repository.js';
import * as documentVersionRepository from '../../../repositories/document-metadata.repository.js';
import * as documentActivityLogRepository from '../../../repositories/document-activity-log.repository.js';
import * as folderRepository from '../../../repositories/folder.repository.js';
import BackOfficeAppError from '../../../utils/app-error.js';
import { getPageCount, getSkipValue } from '../../../utils/database-pagination.js';
import logger from '../../../utils/logger.js';
import {
	mapDocumentVersionDetails,
	mapSingleDocumentDetailsFromVersion
} from '../../../utils/mapping/map-document-details.js';
import { applicationStates } from '../../state-machine/application.machine.js';
import {
	extractDuplicates,
	formatDocumentUpdateResponseBody,
	getIndexFromReference,
	makeDocumentReference,
	markDocumentVersionAsPublished,
	obtainURLForDocumentVersion,
	obtainURLsForDocuments,
	publishNsipDocuments,
	upsertDocumentVersionAndReturnDetails
} from './document.service.js';
import {
	fetchDocumentByGuidAndCaseId,
	getRedactionStatus,
	validateDocumentVersionMetadataBody,
	verifyAllDocumentsHaveRequiredPropertiesForPublishing
} from './document.validators.js';
import { mapDateStringToUnixTimestamp } from '../../../utils/mapping/map-date-string-to-unix-timestamp.js';

/**
 * @typedef {import('apps/api/src/database/schema.js').Document} Document
 * @typedef {import('apps/api/src/database/schema.js').DocumentDetails} DocumentDetails
 * @typedef {import('apps/api/src/database/schema.js').DocumentVersionInput} DocumentVersion
 */

/**
 * @type {import('express').RequestHandler<any, any, { blobStorageHost: string, privateBlobContainer: string, documents: { documentName: string, blobStoreUrl: string }[] } | any, any>}
 * @throws {BackOfficeAppError} if the case cannot be found
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
	const documentsToUpload = body[''];

	const lastDocumentsInCase = await documentRepository.getByCaseId({
		caseId: /** @type {number} */ (params.id),
		skipValue: 0,
		pageSize: 1
	});
	const lastDocument = lastDocumentsInCase?.[0];

	const theCase = await caseRepository.getById(params.id, {
		applicationDetails: true,
		gridReference: true
	});

	if (!theCase?.reference) {
		throw new BackOfficeAppError(`Received null when retrieving case with ID ${params.id}`, 404);
	}

	const lastReferenceIndex = lastDocument?.reference
		? getIndexFromReference(lastDocument.reference)
		: 1;
	let nextReferenceIndex = lastReferenceIndex ? lastReferenceIndex + 1 : 1;

	const { duplicates, remainder } = await extractDuplicates(documentsToUpload);
	const filteredToUpload = /** @type {Document[]} */ (documentsToUpload).filter((doc) =>
		remainder.includes(doc.documentName)
	);

	for (const doc of filteredToUpload) {
		doc.documentReference = makeDocumentReference(theCase.reference, nextReferenceIndex);
		nextReferenceIndex++;
	}

	// Obtain URLs for documents from blob storage
	const { response: dbResponse, failedDocuments } = await obtainURLsForDocuments(
		filteredToUpload,
		params.id
	);

	if (dbResponse === null) {
		response.status(409).send({ failedDocuments, duplicates });
		return;
	}

	const { blobStorageHost, privateBlobContainer, documents } = dbResponse;

	// Map the obtained URLs with documentName
	const documentsWithUrls = documents.map((document) => {
		return pick(document, ['documentName', 'documentReference', 'blobStoreUrl', 'GUID']);
	});

	// Send response with blob storage host, container, and documents with URLs
	response.status([...failedDocuments, ...duplicates].length > 0 ? 206 : 200).send({
		blobStorageHost,
		privateBlobContainer,
		documents: documentsWithUrls,
		failedDocuments,
		duplicates
	});
};

/**
 *
 * @type {import('express').RequestHandler<any, any, { blobStorageHost: string, privateBlobContainer: string, documents: { documentName: string, blobStoreUrl: string }[] } | any, any>}
 */
export const provideDocumentVersionUploadURL = async ({ params, body }, response) => {
	const documentToUpload = body;

	// Obtain URL of document from blob storage
	const { blobStorageHost, privateBlobContainer, documents } = await obtainURLForDocumentVersion(
		documentToUpload,
		Number(params.id),
		params.guid
	);

	// Map the obtained URLs with documentName
	const documentsWithUrls = documents.map((document) => {
		return pick(document, ['documentName', 'documentReference', 'blobStoreUrl', 'GUID']);
	});

	// Send response with blob storage host, container, and documents with URLs
	response.send({
		blobStorageHost,
		privateBlobContainer,
		document: documentsWithUrls[0]
	});
};

/**
 * Updates the status and / or redaction status of an array of documents
 * There can be a status parameter, or a redacted parameter, or both
 *
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
 */
export const updateDocuments = async ({ body }, response) => {
	const { status: publishedStatus, redacted: isRedacted, documents } = body[''];
	const formattedResponseList = [];

	let redactedStatus;

	// special case - this fn can be called without setting redaction status - in which case a redaction status should not be passed in to the update fn
	// and the redaction status of each document should remain unchanged.
	if (typeof isRedacted !== 'undefined') {
		redactedStatus = getRedactionStatus(isRedacted);
	}

	// special case - for Ready to Publish, need to check that required metadata is set on all the files - else error
	if (publishedStatus === 'ready_to_publish') {
		const documentIds = documents.map((/** @type {{ guid: string; }} */ document) => document.guid);

		await verifyAllDocumentsHaveRequiredPropertiesForPublishing(documentIds);
	}

	if (documents) {
		for (const document of documents) {
			logger.info(
				`Updating document with guid: ${document.guid} to published status: ${publishedStatus} and redacted status: ${redactedStatus}`
			);

			// To get things moving, we're going to assume every call to this endpoint is updating the latest version.
			// This is fine from a requirements perspective, but opens us up to race conditions
			// TODO: Let's refactor this so that the front-end provides the explicitly verson numbers
			// @ts-ignore
			const { latestDocumentVersion: documentVersion } = await documentRepository.getByDocumentGUID(
				document.guid
			);

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

			if (typeof publishedStatus === 'undefined') {
				delete documentVersionUpdates.publishedStatus;
			} else {
				// when setting publishedStatus, save previous publishedStatus

				// do we have a previous doc version, does it have a published status, and is that status different
				if (
					typeof documentVersion !== 'undefined' &&
					typeof documentVersion.publishedStatus !== 'undefined' &&
					documentVersion.publishedStatus !== publishedStatus
				) {
					documentVersionUpdates.publishedStatusPrev = documentVersion.publishedStatus;
				}
			}

			const updateResponseInTable = await documentVersionRepository.update(document.guid, {
				version: documentVersion.version,
				...documentVersionUpdates
			});
			const formattedResponse = formatDocumentUpdateResponseBody(
				updateResponseInTable.documentGuid ?? '',
				updateResponseInTable.publishedStatus ?? '',
				updateResponseInTable.redactedStatus ?? ''
			);

			formattedResponseList.push(formattedResponse);
		}
	}

	logger.info(`Updated ${documents.length} documents`);
	response.send(formattedResponseList);
};

/**
 *
 * @type {import('express').RequestHandler<{id: string;guid: string}, ?, ?, any>}
 * @throws {BackOfficeAppError} if the metadata cannot be stored in the database.
 * @returns {Promise<void>} A Promise that resolves when the metadata has been successfully stored in the database.
 * */
export const getDocumentFolderPath = async ({ params: { guid } }, response) => {
	const document = await documentRepository.getById(guid);
	if (!document) {
		throw new BackOfficeAppError(`Unknown document guid ${guid}`, 404);
	}

	const folders = await folderRepository.getFolderWithParents(document.folderId);

	response.send(folders);
};

/**
 * Gets the properties/metadata for a single document
 *
 * @type {import('express').RequestHandler<{id: string;guid: string}, ?, ?, any>}
 * @throws {BackOfficeAppError} if the metadata cannot be stored in the database.
 * @returns {Promise<void>} A Promise that resolves when the metadata has been successfully stored in the database.
 */
export const getDocumentProperties = async ({ params: { guid } }, response) => {
	// Step 1: Retrieve the document by its GUID and case ID.
	const document = await documentRepository.getById(guid);

	if (!document) {
		throw new BackOfficeAppError(`Unknown document guid ${guid}`, 404);
	}

	// Step 2: Retrieve the metadata for the document version associated with the GUID.
	const documentVersion = await documentVersionRepository.getById(
		document.guid,
		document.latestVersionId
	);

	// Step 3: If the document metadata is not found, throw an error.
	if (documentVersion === null || typeof documentVersion === 'undefined') {
		throw new BackOfficeAppError(`Unknown document metadata guid ${guid}`, 404);
	}

	// Step 4: Map the document metadata to a format to be returned in the API response.
	const documentDetails = mapSingleDocumentDetailsFromVersion(documentVersion);

	// Step 5: Return the document metadata in the response.
	response.status(200).send(documentDetails);
};

/**
 * Gets the properties/metadata for a single document
 *
 * @type {import('express').RequestHandler<{id: string;guid: string, version: number}, ?, ?, any>}
 * @throws {BackOfficeAppError} if the metadata cannot be stored in the database.
 * @returns {Promise<void>} A Promise that resolves when the metadata has been successfully stored in the database.
 */
export const getDocumentVersionProperties = async ({ params: { guid, version } }, response) => {
	// Step 1: Retrieve the document by its GUID and case ID.
	const document = await documentRepository.getById(guid);

	if (!document) {
		throw new BackOfficeAppError(`Unknown document guid ${guid}`, 404);
	}

	// Step 2: Retrieve the metadata for the document version associated with the GUID.
	const documentVersion = await documentVersionRepository.getById(document.guid, +version);

	// Step 3: If the document metadata is not found, throw an error.
	if (documentVersion === null || typeof documentVersion === 'undefined') {
		throw new BackOfficeAppError(`Unknown document metadata guid ${guid}`, 404);
	}

	// Step 4: Map the document metadata to a format to be returned in the API response.
	const documentDetails = mapSingleDocumentDetailsFromVersion(documentVersion);

	// Step 5: Return the document metadata in the response.
	response.status(200).send(documentDetails);
};

/**
 *
 * @param {*} activityLogs
 * @returns {Object}
 */
const mapHistory = (activityLogs) => {
	const history = {};

	// @ts-ignore
	activityLogs.forEach((activityLog) => {
		// @ts-ignore
		history[activityLog.status] = {
			date: activityLog?.createdAt
				? mapDateStringToUnixTimestamp(activityLog?.createdAt?.toString())
				: null,
			name: activityLog.user
		};
	});

	return history;
};

/**
 * Gets the properties/metadata for a single document
 *
 * @type {import('express').RequestHandler<{id: string;guid: string}, ?, ?, any>}
 * @throws {BackOfficeAppError} if the metadata cannot be stored in the database.
 * @returns {Promise<void>} A Promise that resolves when the metadata has been successfully stored in the database.
 */
export const getDocumentVersions = async ({ params: { guid } }, response) => {
	const documentVersions = await documentVersionRepository.getAllByDocumentGuid(guid);

	if (!documentVersions || documentVersions.length === 0) {
		throw new BackOfficeAppError(`No document versions found for guid ${guid}`, 404);
	}

	const mappedDocumentVersions = documentVersions.map(
		(/** @type {Record<string, any>} */ documentVersion) => ({
			...documentVersion,
			dateCreated: documentVersion?.dateCreated
				? mapDateStringToUnixTimestamp(documentVersion?.dateCreated?.toString())
				: null,
			datePublished: documentVersion?.datePublished
				? mapDateStringToUnixTimestamp(documentVersion?.datePublished?.toString())
				: null,
			history:
				documentVersion?.DocumentActivityLog?.length > 0
					? mapHistory(documentVersion.DocumentActivityLog)
					: null
			// TODO: add unpublished date
		})
	);

	response.status(200).send(mappedDocumentVersions);
};

/**
 * Revert the published status of a document to the previous published status.
 *
 * @type {import('express').RequestHandler<{id: number;guid: string}, any, any, any>}
 */
export const revertDocumentPublishedStatus = async ({ params: { guid } }, response) => {
	const documentVersion = await documentVersionRepository.getById(guid);

	if (!documentVersion) {
		throw new BackOfficeAppError(`No document found`, 404);
	}

	if (
		typeof documentVersion.publishedStatusPrev === 'undefined' ||
		documentVersion.publishedStatusPrev === null
	) {
		throw new BackOfficeAppError(`No previous published status to revert to`, 412);
	}

	const publishedStatusToRevertTo = documentVersion.publishedStatusPrev;

	logger.info(
		`updating document version ${guid} to previous publishedStatus: '${publishedStatusToRevertTo}'`
	);
	await documentVersionRepository.update(guid, {
		publishedStatus: publishedStatusToRevertTo,
		publishedStatusPrev: null
	});
	response.sendStatus(200);
};

/**
 * Soft deletes a document by its GUID and case ID.
 *
 *@async
 * @type {import('express').RequestHandler<{id:string; guid: string;}, ?, ?, any>}
 * @throws {BackOfficeAppError} If the document is published, or if the document cannot be deleted for any other reason.
 * @returns {Promise<void>} An object with the key "isDeleted" set to true.
 */
export const deleteDocumentSoftly = async ({ params: { id: caseId, guid } }, response) => {
	// Step 1: Fetch the document to be deleted from the database
	const document = await fetchDocumentByGuidAndCaseId(guid, +caseId);

	// Step 2: Check if the document is published; if so, throw an error as it cannot be deleted
	const documentIsPublished =
		document.status?.toLowerCase() === applicationStates.published?.toLowerCase();

	if (documentIsPublished) {
		throw new BackOfficeAppError(
			`unable to delete document guid ${guid} related to caseId ${caseId}`,
			400
		);
	}

	// Step 3: Soft delete the document from the database
	await documentRepository.deleteDocument(guid);

	// Step 4: Send a success response to the client
	response.status(200).send({ isDeleted: true });
};

/**
 * Creates or updates a document metadata record in the database.
 *
 * @async
 * @function
 * @name storeDocumentVersion
 * @type {import('express').RequestHandler<{id: string; guid:string;}, ?, ?, any>}
 * @throws {BackOfficeAppError} if the metadata cannot be stored in the database.
 * @returns {Promise<void>} A Promise that resolves when the metadata has been successfully stored in the database.
 */
export const storeDocumentVersion = async (request, response) => {
	// Extract caseId and guid from the request parameters
	const { guid } = request.params;

	// Validate the request body and extract the document version metadata
	/** @type {DocumentVersion} */
	const documentVersionMetadataBody = validateDocumentVersionMetadataBody(request.body);

	// Retrieve the document from the database using the provided guid and caseId
	const document = await documentRepository.getById(guid);

	if (!document) {
		throw new BackOfficeAppError(`Document not found: guid ${guid}`, 404);
	}

	// Upsert the document version metadata to the database and get the updated document details
	const documentDetails = await upsertDocumentVersionAndReturnDetails(
		document.guid,
		documentVersionMetadataBody,
		document.latestVersionId
	);

	// Send the document details back in the response
	response.status(200).send(documentDetails);
};

/**
 * Gets paginated array of documents in a folder
 *
 * @type {import('express').RequestHandler<{ folderId: number, id: number }, ?, {pageNumber?: number, pageSize?: number}, any>}
 */
export const getReadyToPublishDocuments = async ({ params: { id }, body }, response) => {
	const { pageNumber = 1, pageSize = 125 } = body;

	const skipValue = getSkipValue(pageNumber, pageSize);

	const paginatedReadyToPublishDocuments = await documentRepository.getDocumentsReadyPublishStatus({
		skipValue,
		pageSize,
		caseId: +id
	});

	const documentsCount = await documentRepository.getDocumentsCountInByPublishStatus(+id);

	console.log('documentsCount ' + documentsCount);

	const mapDocument = paginatedReadyToPublishDocuments.map(
		// @ts-ignore
		({ latestDocumentVersion, ...Document }) => ({
			Document,
			...latestDocumentVersion
		})
	);

	response.send({
		page: pageNumber,
		pageDefaultSize: pageSize,
		pageCount: getPageCount(documentsCount, pageSize),
		itemCount: documentsCount,
		items: mapDocumentVersionDetails(mapDocument)
	});
};

/**
 * Publishes an array of documents
 * on any errors, none are published
 *
 * @type {import('express').RequestHandler}
 */
export const publishDocuments = async ({ body }, response) => {
	const { documents, username } = body;

	const documentIds = documents.map((/** @type {{ guid: string; }} */ document) => document.guid);

	const publishableDocumentVersionIds = await verifyAllDocumentsHaveRequiredPropertiesForPublishing(
		documentIds
	);

	/**
	 * @type {any[]}
	 */
	const activityLogs = [];
	publishableDocumentVersionIds.forEach((document) => {
		activityLogs.push(
			documentActivityLogRepository.create({
				documentGuid: document.documentGuid,
				version: document.version,
				user: username,
				status: 'published'
			})
		);
	});

	// @ts-ignore
	await Promise.all(activityLogs);

	const publishedDocuments = await publishNsipDocuments(publishableDocumentVersionIds);

	logger.info(`Published ${publishedDocuments.length} documents`);
	response.send(
		publishedDocuments.map(({ documentGuid, publishedStatus }) => ({
			guid: documentGuid,
			publishedStatus
		}))
	);
};

/**
 * @type {import('express').RequestHandler}
 */
export const markAsPublished = async (
	{ params, body: { publishedBlobPath, publishedBlobContainer, publishedDate } },
	response
) => {
	const { guid, version } = params;

	const updateResponse = await markDocumentVersionAsPublished({
		guid,
		version: +version,
		publishedBlobPath,
		publishedBlobContainer,
		publishedDate: new Date(publishedDate)
	});

	response.send(updateResponse);
};
