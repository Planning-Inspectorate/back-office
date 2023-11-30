import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import logger from '#utils/logger.js';
import { mapDocumentsForDatabase, mapDocumentsForBlobStorage } from './documents.mapper.js';
import { getByCaseId, getByCaseIdPath, getById } from '#repositories/folder.repository.js';
import {
	addDocument,
	addDocumentVersion,
	deleteDocumentVersion,
	addDocumentVersionAudit
} from '#repositories/document-metadata.repository.js';
import { formatFolder } from './documents.formatter.js';
import documentRedactionStatusRepository from '#repositories/document-redaction-status.repository.js';
import { ERROR_NOT_FOUND } from '#endpoints/constants.js';

/** @typedef {import('../appeals.js').RepositoryGetByIdResultItem} RepositoryResult */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.DocumentVersion} DocumentVersion */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.AuditTrail} AuditTrail */
/** @typedef {import('@pins/appeals.api').Appeals.SingleFolderResponse} SingleFolderResponse */
/** @typedef {import('@pins/appeals/index.js').AddDocumentsRequest} AddDocumentsRequest */
/** @typedef {import('@pins/appeals/index.js').AddDocumentVersionRequest} AddDocumentVersionRequest */
/** @typedef {import('@pins/appeals/index.js').AddDocumentsResponse} AddDocumentsResponse */
/** @typedef {import('@pins/appeals/index.js').DocumentMetadata} DocumentMetadata */

/**
 * @param {RepositoryResult} appeal
 * @param {string} folderId
 * @returns {Promise<SingleFolderResponse | null>}
 */
export const getFolderForAppeal = async (appeal, folderId) => {
	const folder = await getById(Number(folderId));
	if (folder && folder.caseId === appeal.id) {
		return formatFolder(folder);
	}

	return null;
};

/**
 * @param {RepositoryResult} appeal
 * @param {string?} path
 * @returns {Promise<Folder[]>}
 */
export const getFoldersForAppeal = async (appeal, path = null) => {
	if (path) {
		return await getByCaseIdPath(appeal.id, path);
	}

	return await getByCaseId(appeal.id);
};

/**
 * @param {AddDocumentsRequest} upload
 * @param {RepositoryResult} appeal
 * @returns {Promise<AddDocumentsResponse>}}
 */
export const addDocumentsToAppeal = async (upload, appeal) => {
	const { blobStorageHost, blobStorageContainer, documents } = upload;
	const documentsToSendToDatabase = mapDocumentsForDatabase(
		appeal.id,
		blobStorageHost,
		blobStorageContainer,
		documents
	);
	const documentsCreated = await addDocumentAndVersion(
		appeal.id,
		appeal.reference,
		documentsToSendToDatabase
	);

	const documentsToAddToBlobStorage = mapDocumentsForBlobStorage(
		documentsCreated,
		appeal.reference
	).filter((d) => d !== null);

	return {
		documents: documentsToAddToBlobStorage
	};
};

/**
 * @param {number} caseId
 * @param {string} reference
 * @param {DocumentMetadata[]} documents
 * @returns {Promise<(DocumentVersion | null)[]>}
 */
const addDocumentAndVersion = async (caseId, reference, documents) => {
	const { results } = await PromisePool.withConcurrency(5)
		.for(documents)
		.handleError((error, document) => {
			logger.error(`Error while upserting document name "${document.name}" to database: ${error}`);
			// @ts-ignore
			error.meta.fileName = document.name;
			throw error;
		})
		.process(async (d) => {
			const document = await addDocument(
				{
					originalFilename: d.name,
					mime: d.mime,
					documentType: d.documentType,
					stage: d.stage,
					size: d.documentSize,
					version: 1,
					blobStorageContainer: d.blobStorageContainer
				},
				{
					caseId,
					reference,
					folderId: Number(d.folderId),
					blobStorageHost: d.blobStorageHost
				}
			);

			if (!document) {
				logger.error(`Error adding document named: ${d.name}`);
				throw new Error(
					`Error adding document named: ${d.name} in folder ${d.folderId} for appeal ${d.caseId}`
				);
			}
			logger.info(`Added document with guid: ${document.documentGuid}`);

			return document;
		});

	logger.info(`Added ${results.length} documents to database`);

	return results;
};

/**
 * @param {AddDocumentVersionRequest} upload
 * @param {RepositoryResult} appeal
 * @param {Document} document
 * @returns {Promise<AddDocumentsResponse>}}
 */
export const addVersionToDocument = async (upload, appeal, document) => {
	if (!document) {
		throw new Error('Document not found');
	}

	const { blobStorageHost, blobStorageContainer, document: uploadedDocument } = upload;
	const documentToSendToDatabase = mapDocumentsForDatabase(
		appeal.id,
		blobStorageHost,
		blobStorageContainer,
		[uploadedDocument]
	)[0];

	const documentVersionCreated = await addDocumentVersion({
		context: {
			blobStorageHost: documentToSendToDatabase.blobStorageHost
		},
		documentGuid: document.guid,
		fileName: document.name,
		originalFilename: documentToSendToDatabase.name,
		mime: documentToSendToDatabase.mime,
		size: documentToSendToDatabase.documentSize,
		stage: documentToSendToDatabase.stage,
		documentType: documentToSendToDatabase.documentType,
		version: 1,
		blobStorageContainer: documentToSendToDatabase.blobStorageContainer
	});

	if (!documentVersionCreated) {
		return {
			documents: []
		};
	}
	const documentsToAddToBlobStorage = mapDocumentsForBlobStorage(
		[documentVersionCreated],
		appeal.reference,
		documentVersionCreated.version
	).filter((d) => d !== null);

	return {
		documents: documentsToAddToBlobStorage
	};
};

/**
 * @returns {Promise<number[]>}
 */
export const getDocumentRedactionStatusIds = async () => {
	const redactionStatuses =
		await documentRedactionStatusRepository.getAllDocumentRedactionStatuses();

	if (!redactionStatuses.length) {
		throw new Error(ERROR_NOT_FOUND);
	}

	return redactionStatuses.map(({ id }) => id);
};

/**
 * @param { Document } document
 * @param { number } version
 * @returns {Promise<(Document | null)>}
 */
export const deleteDocument = async (document, version) => {
	const result = await deleteDocumentVersion(document.guid, version);
	return result || null;
};

/**
 * @param { string } guid
 * @param { number } version
 * @param { AuditTrail } auditTrail
 * @param { string } action
 */
export const addDocumentAudit = async (guid, version, auditTrail, action) => {
	await addDocumentVersionAudit(guid, version, action, auditTrail.id);
};
