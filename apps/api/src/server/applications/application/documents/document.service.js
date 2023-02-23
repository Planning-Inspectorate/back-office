import * as caseRepository from '../../../repositories/case.repository.js';
import * as documentRepository from '../../../repositories/document.repository.js';
import { getStorageLocation } from '../../../utils/document-storage-api-client.js';

/**
 *
 * @param {{documentName: string, folderId: number, documentType: string, documentSize: number}[]} documents
 * @returns {{name: string, folderId: number, fileType: string, fileSize: number}[]}
 */
const mapDocumentsToSendToDatabase = (documents) => {
	return documents.map((document) => {
		return {
			name: document.documentName,
			folderId: document.folderId,
			fileType: document.documentType,
			fileSize: document.documentSize
		};
	});
};

/**
 *
 * @param {{name: string, folderId: number}[]} documents
 * @returns {Promise<import('@pins/api').Schema.Document[]>}
 */
const upsertDocumentsToDatabase = async (documents) => {
	return Promise.all(
		documents.map((documentToDatabase) => {
			return documentRepository.upsert(documentToDatabase);
		})
	);
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
 * @param {number} caseId
 * @returns {Promise<{blobStorageHost: string, blobStorageContainer: string, documents: {blobStoreUrl: string, caseType: string, caseReference: string,documentName: string, GUID: string}[]}>}}
 */
export const obtainURLsForDocuments = async (documentsToUpload, caseId) => {
	const caseForDocuments = await caseRepository.getById(caseId, {});

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

	await updateDocumentsWithContainersAndPaths(
		responseFromDocumentStorage.documents,
		responseFromDocumentStorage.blobStorageContainer
	);

	return responseFromDocumentStorage;
};

/**
 *
 * @param {number} id
 */
export const fetchDocumentMetadata = async (id) => {
	const documentMetadata = [
		{
			id: 77,
			metadataId: 'abc123',
			representative: 'DDE Agriculture',
			documentGuid: 'xyz789',
			caseRef: 'EN010120',
			horizonDataID: 'EN010120-001',
			version: '1.0',
			filename: 'document.pdf',
			originalFilename: null,
			size: 1024,
			mime: 'application/pdf',
			documentURI: 'https://example.com/documents/abc123',
			path: null,
			virusCheckStatus: 'Scanned',
			fileMD5: 'abcd1234',
			dateCreated: '2023-02-21T10:30:00Z',
			lastModified: '2023-02-21T11:30:00Z',
			caseType: null,
			documentStatus: 'Internal',
			redacted: false,
			published: false,
			datePublished: null,
			documentType: 'Report',
			securityClassification: 'Official',
			sourceSystem: 'NI Filestore',
			origin: 'PINS',
			owner: null,
			author: null,
			description:
				'Attachments to the letter to Department for Business, Energy & Industrial Strategy',
			stage: null
		}
	];

	return documentMetadata.find((data) => data.id === id);
};
