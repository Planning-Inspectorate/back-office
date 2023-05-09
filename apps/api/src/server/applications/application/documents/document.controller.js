import { pick } from 'lodash-es';
import * as documentRepository from '../../../repositories/document.repository.js';
import * as documentVersionRepository from '../../../repositories/document-metadata.repository.js';
import BackOfficeAppError from '../../../utils/app-error.js';
import { getPageCount, getSkipValue } from '../../../utils/database-pagination.js';
import logger from '../../../utils/logger.js';
import {
	mapDocumentVersionDetails,
	mapSingleDocumentDetailsFromVersion
} from '../../../utils/mapping/map-document-details.js';
import { applicationStates } from '../../state-machine/application.machine.js';
import {
	formatDocumentUpdateResponseBody,
	obtainURLForDocumentVersion,
	obtainURLsForDocuments,
	upsertDocumentVersionAndReturnDetails
} from './document.service.js';
import {
	fetchDocumentByGuidAndCaseId,
	getRedactionStatus,
	validateDocumentVersionMetadataBody,
	verifyAllDocumentsHaveRequiredPropertiesForPublishing
} from './document.validators.js';

/**
 * @typedef {import('apps/api/src/database/schema.js').Document} Document
 * @typedef {import('apps/api/src/database/schema.js').DocumentDetails} DocumentDetails
 * @typedef {import('apps/api/src/database/schema.js').DocumentVersionInput} DocumentVersion
 */

/**
 *
 * @type {import('express').RequestHandler<any, any, { blobStorageHost: string, blobStorageContainer: string, documents: { documentName: string, blobStoreUrl: string }[] } | any, any>}
 */
export const provideDocumentUploadURLs = async ({ params, body }, response) => {
	const documentsToUpload = body[''];

	// Obtain URLs for documents from blob storage
	const { blobStorageHost, blobStorageContainer, documents } = await obtainURLsForDocuments(
		documentsToUpload,
		params.id
	);

	// Map the obtained URLs with documentName
	const documentsWithUrls = documents.map((document) => {
		return pick(document, ['documentName', 'blobStoreUrl']);
	});

	// Send response with blob storage host, container, and documents with URLs
	response.send({
		blobStorageHost,
		blobStorageContainer,
		documents: documentsWithUrls
	});
};

/**
 *
 * @type {import('express').RequestHandler<any, any, { blobStorageHost: string, blobStorageContainer: string, documents: { documentName: string, blobStoreUrl: string }[] } | any, any>}
 */
export const provideDocumentVersionUploadURL = async ({ params, body }, response) => {
	const documentsToUpload = body[''];

	// Obtain URLs for documents from blob storage
	const { blobStorageHost, blobStorageContainer, documents } = await obtainURLForDocumentVersion(
		documentsToUpload,
		params.id,
		params.documentId
	);

	// Map the obtained URLs with documentName
	const documentsWithUrls = documents.map((document) => {
		return pick(document, ['documentName', 'blobStoreUrl']);
	});

	// Send response with blob storage host, container, and documents with URLs
	response.send({
		blobStorageHost,
		blobStorageContainer,
		documents: documentsWithUrls
	});
};

/**
 * Updates the status and / or redaction status of an array of documents
 * There can be a status parameter, or a redacted parameter, or both
 *
 * @type {import('express').RequestHandler<{id: number}, any, any, any>}
 */
export const updateDocuments = async ({ body }, response) => {
	const { status: publishedStatus, redacted: isRedacted, items } = body[''];
	const formattedResponseList = [];

	let redactedStatus;

	// special case - this fn can be called without setting redaction status - in which case a redaction status should not be passed in to the update fn
	// and the redaction status of each document should remain unchanged.
	if (typeof isRedacted !== 'undefined') {
		redactedStatus = getRedactionStatus(isRedacted);
	}

	// special case - for Ready to Publish, need to check that required metadata is set on all the files - else error
	if (publishedStatus === 'ready_to_publish') {
		await verifyAllDocumentsHaveRequiredPropertiesForPublishing(items);
	}

	if (items) {
		for (const document of items) {
			logger.info(
				`Updating document with guid: ${document.guid} to published status: ${publishedStatus} and redacted status: ${redactedStatus}`
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
				const documentVersion = await documentVersionRepository.getById(document.guid);

				// do we have a previous doc version, does it have a published status, and is that status different
				if (
					typeof documentVersion !== 'undefined' &&
					typeof documentVersion.publishedStatus !== 'undefined' &&
					documentVersion.publishedStatus !== publishedStatus
				) {
					documentVersionUpdates.publishedStatusPrev = documentVersion.publishedStatus;
				}
			}

			const updateResponseInTable = await documentVersionRepository.update(
				document.guid,
				documentVersionUpdates
			);
			const formattedResponse = formatDocumentUpdateResponseBody(
				updateResponseInTable.documentGuid ?? '',
				updateResponseInTable.publishedStatus ?? '',
				updateResponseInTable.redactedStatus ?? ''
			);

			formattedResponseList.push(formattedResponse);
		}
	}

	logger.info(`Updated ${items.length} documents`);
	response.send(formattedResponseList);
};

/**
 * Gets the properties/metadata for a single document
 *
 * @type {import('express').RequestHandler<{id: string;guid: string}, ?, ?, any>}
 * @throws {BackOfficeAppError} if the metadata cannot be stored in the database.
 * @returns {Promise<void>} A Promise that resolves when the metadata has been successfully stored in the database.
 */
export const getDocumentProperties = async ({ params: { id: caseId, guid } }, response) => {
	// Step 1: Retrieve the document by its GUID and case ID.
	const document = await fetchDocumentByGuidAndCaseId(guid, +caseId);

	// Step 2: Retrieve the metadata for the document version associated with the GUID.
	const documentVersion = await documentVersionRepository.getById(document.guid);

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
	const { id: caseId, guid } = request.params;

	// Validate the request body and extract the document version metadata
	/** @type {DocumentVersion} */
	const documentVersionMetadataBody = validateDocumentVersionMetadataBody(request.body);

	// Retrieve the document from the database using the provided guid and caseId
	const document = await fetchDocumentByGuidAndCaseId(guid, +caseId);

	// Upsert the document version metadata to the database and get the updated document details
	const documentDetails = await upsertDocumentVersionAndReturnDetails(
		document.guid,
		documentVersionMetadataBody
	);

	// Send the document details back in the response
	response.status(200).send(documentDetails);
};

/**
 * Gets paginated array of documents in a folder
 *
 * @type {import('express').RequestHandler<{ folderId: number }, ?, {pageNumber?: number, pageSize?: number}, any>}
 */
export const getReadyToPublishDocuments = async ({ body }, response) => {
	const { pageNumber = 1, pageSize = 125 } = body;
	const skipValue = getSkipValue(pageNumber, pageSize);

	const paginatedReadyToPublishDocuments = await documentRepository.getDocumentsReadyPublishStatus({
		skipValue,
		pageSize
	});

	const documentsCount = await documentRepository.getDocumentsCountInByPublishStatus();

	// @ts-ignore
	const mapDocument = paginatedReadyToPublishDocuments.map(({ documentVersion, ...Document }) => ({
		Document,
		...documentVersion[0]
	}));

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
	const { items } = body;
	const formattedResponseList = [];

	// same as for Ready To Publish, need to check that required metadata is set on all the files - else error
	await verifyAllDocumentsHaveRequiredPropertiesForPublishing(items);

	if (items) {
		for (const document of items) {
			logger.info(`publishing document with guid: ${document.guid}`);

			/**
			 * @typedef {object} PublishUpdates
			 * @property {string} [publishedStatus]
			 * @property {string} [publishedStatusPrev]
			 * @property {Date} [datePublished]
			 * @property {boolean} [published]
			 */

			/** @type {PublishUpdates} */
			const documentVersionUpdates = {
				publishedStatus: 'published',
				publishedStatusPrev: 'ready_to_publish',
				datePublished: new Date(),
				published: true
			};
			const updateResponseInTable = await documentVersionRepository.update(
				document.guid,
				documentVersionUpdates
			);

			// there is also a status field in Document - update this too
			await documentRepository.update(document.guid, { status: 'published' });

			const formattedResponse = {
				guid: updateResponseInTable.documentGuid,
				status: updateResponseInTable.publishedStatus
			};

			// TODO: now xfer the file to the correct destination, and pass the message to the service bus
			// TODO: call document-publish-function.  Also need to populate and send required doc properties
			formattedResponseList.push(formattedResponse);
		}
	}

	logger.info(`Published ${items.length} documents`);
	response.send(formattedResponseList);
};
