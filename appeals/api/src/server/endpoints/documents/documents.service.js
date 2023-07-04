import { PromisePool } from '@supercharge/promise-pool/dist/promise-pool.js';
import logger from '../../utils/logger.js';
import appealRepository from '../../repositories/appeal.repository.js';
import {
	mapDocumentsForDatabase,
	mapDocumentsForBlobStorage,
	mapDocumentNameForStorageUrl,
	mapBlobPath
} from './documents.mapper.js';
import { upsertCaseFolders } from '../../repositories/folder.repository.js';
import {
	getDocumentsByAppealId,
	getDocumentById,
	upsertDocument,
	updateDocument
} from '../../repositories/document.repository.js';
import { upsertDocumentVersion } from '../../repositories/document-metadata.repository.js';

/** @typedef {import("../appeals.js").RepositoryGetByIdResultItem} RepositoryResult */
/** @typedef {import('@pins/appeals.api').Schema.Document} Document */
/** @typedef {import('@pins/appeals.api').Schema.Folder} Folder */
/** @typedef {import('@pins/appeals.api').Schema.FolderTemplate} FolderTemplate */
/** @typedef {import('@pins/appeals/index.js').BlobInfo} BlobInfo */
/** @typedef {import('@pins/appeals/index.js').DocumentApiRequest} DocumentApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentVersionApiRequest} DocumentVersionApiRequest */
/** @typedef {import('@pins/appeals/index.js').DocumentMetadata} DocumentMetadata */

/**
 * Returns a list of document paths available for the current Appeal
 * @param {number} appealId
 * @param {('appellantCase'|'lpaQuestionnaire'|null)} sectionName
 * @returns {Promise<Folder[]>}
 */
export const getDocumentsForAppeal = async (appealId, sectionName = null) => {
	const appeal = await getAppeal(appealId);
	if (!appeal) {
		return [];
	}

	const folderLayout = await upsertCaseFolders(appealId);
	const documents = await getDocumentsByAppealId(appealId);

	for (const folder of folderLayout) {
		// @ts-ignore
		folder.documents = documents.filter((d) => d.folderId === folder.id);
	}

	if (sectionName) {
		return folderLayout.filter((f) => f.path.indexOf(sectionName) >= 0);
	}

	return folderLayout;
};

/**
 * Returns a list of document paths available for the current Appeal
 * @param {string} documentId
 * @returns {Promise<Document>}
 */
export const getDocumentForAppeal = async (documentId) => {
	const document = await getDocumentById(documentId);
	return document;
};

/**
 * @param {DocumentApiRequest} upload
 * @param {number} appealId
 * @returns {Promise<{documents: BlobInfo[]}>}}
 */
export const addDocumentsToAppeal = async (upload, appealId) => {
	const appeal = await getAppeal(appealId);
	if (!appeal || appeal.reference == null) {
		throw new Error('Case not found or has no reference');
	}
	const { blobStorageContainer, documents } = upload;
	const documentsToSendToDatabase = mapDocumentsForDatabase(
		appealId,
		blobStorageContainer,
		documents
	);
	const documentsFromDatabase = await upsertDocumentMetadata(
		appealId,
		appeal.reference,
		documentsToSendToDatabase
	);

	return {
		documents: mapDocumentsForBlobStorage(documentsFromDatabase, appeal.reference)
	};
};

/**
 * @param {DocumentVersionApiRequest} upload
 * @param {number} appealId
 * @param {string} documentId
 * @returns {Promise<{documents: BlobInfo[]}>}}
 */
export const addVersionToDocument = async (upload, appealId, documentId) => {
	const appeal = await getAppeal(appealId);
	if (!appeal || appeal.reference == null) {
		throw new Error('Case not found or has no reference');
	}

	const { blobStorageContainer, document } = upload;
	const documentsToSendToDatabase = mapDocumentsForDatabase(appealId, blobStorageContainer, [
		document
	]);

	const documentVersion = documentsToSendToDatabase[0];
	const masterDocument = await getDocumentById(documentId);
	const newVersionId = masterDocument.latestVersionId + 1;
	const newDocumentVersion = await upsertDocumentVersion({
		documentGuid: documentId,
		fileName: masterDocument.name,
		originalFilename: mapDocumentNameForStorageUrl(documentVersion.name),
		mime: documentVersion.documentType,
		size: documentVersion.documentSize,
		version: newVersionId,
		blobStoragePath: mapBlobPath(
			masterDocument.guid,
			appeal.reference,
			documentVersion.name,
			newVersionId
		),
		blobStorageContainer: documentVersion.blobStorageContainer
	});

	await updateDocument(documentId, {
		latestVersionId: newDocumentVersion.version
	});

	return {
		documents: mapDocumentsForBlobStorage(
			[newDocumentVersion.Document],
			appeal.reference,
			newVersionId
		)
	};
};

/**
 * Returns the current appeal by reference
 * @param {number} appealId
 * @returns {Promise<RepositoryResult|void>}
 */
const getAppeal = async (appealId) => {
	const appeal = await appealRepository.getById(appealId);
	return appeal;
};

/**
 *
 * @param {number} caseId
 * @param {string} reference
 * @param {DocumentMetadata[]} documents
 * @returns {Promise<Document[]>}
 */
const upsertDocumentMetadata = async (caseId, reference, documents) => {
	const { results } = await PromisePool.withConcurrency(5)
		.for(documents)
		.handleError((error) => {
			logger.error(`Error while upserting documents to database: ${error}`);
			throw error;
		})
		.process(async (documentToDB) => {
			const fileName = mapDocumentNameForStorageUrl(documentToDB.name);
			const document = await upsertDocument({
				name: fileName,
				caseId,
				folderId: Number(documentToDB.folderId)
			});

			logger.info(`Upserted document with guid: ${document.guid}`);

			await upsertDocumentVersion({
				documentGuid: document.guid,
				fileName,
				originalFilename: fileName,
				mime: documentToDB.documentType,
				size: documentToDB.documentSize,
				version: 1,
				blobStoragePath: mapBlobPath(document.guid, reference, fileName, 1),
				blobStorageContainer: documentToDB.blobStorageContainer
			});

			await updateDocument(document.guid, {
				latestVersionId: 1
			});

			logger.info(`Upserted metadata for document with guid: ${document.guid}`);

			return document;
		});

	logger.info(`Upserted ${results.length} documents to database`);

	return results;
};
