// @ts-nocheck
import { jest } from '@jest/globals';
import * as folderRepository from '#repositories/folder.repository.js';
import { defaultCaseFolders } from '#repositories/folder.layout.repository.js';
import {
	appeal,
	folder,
	addDocumentsRequest,
	addDocumentVersionRequest,
	blobInfo,
	documentCreated,
	documentUpdated,
	documentVersionCreated,
	documentVersionRetrieved
} from '#tests/documents/mocks.js';
import * as mappers from '../documents.mapper.js';
import * as service from '../documents.service.js';
import * as controller from '../documents.controller.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const { default: got } = await import('got');

describe('appeals documents', () => {
	describe('appeals folders', () => {
		test('all document folders are linked to the correct appeal', async () => {
			const appealId = 2000;
			const foldersForCase = defaultCaseFolders(appealId);
			expect(foldersForCase.length).toBeGreaterThan(0);
			foldersForCase.forEach((f) => expect(f.caseId).toEqual(appealId));
		});

		test('finds all top level folders when case has folders attached', async () => {
			databaseConnector.folder.findMany.mockResolvedValue(defaultCaseFolders(10));
			const folders = await folderRepository.getByCaseId(10);
			expect(folders).toEqual(defaultCaseFolders(10));
		});
	});

	describe('mappers', () => {
		test('appeal reference is safely escaped for blob URLs', async () => {
			const mappedRef = mappers.mapCaseReferenceForStorageUrl(appeal.reference);
			expect(mappedRef).not.toContain('/');
			expect(blobInfo.blobStoreUrl).toContain(mappedRef);
		});

		test('blob URL includes GUID and version', async () => {
			const mappedPath = mappers.mapBlobPath(
				blobInfo.GUID,
				blobInfo.caseReference,
				blobInfo.documentName || 'test',
				1
			);
			expect(mappedPath).toContain('/v1/');
			expect(mappedPath).toContain(blobInfo.GUID);
		});
	});

	describe('post documents', () => {
		test('post single document throws error when case not exist', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(null);
			got.post.mockReturnValue({ json: jest.fn().mockResolvedValue(null) });
			await expect(controller.addDocuments).rejects.toThrow(Error);
		});

		test('add new version thows error when document not exist', async () => {
			databaseConnector.appeal.findUnique.mockResolvedValue(appeal);
			databaseConnector.document.findUnique.mockResolvedValue(null);
			got.post.mockReturnValue({ json: jest.fn().mockResolvedValue(null) });

			await expect(service.addVersionToDocument).rejects.toThrow(Error);
		});

		test('post single document', async () => {
			const mappedReq = mappers.mapDocumentsForDatabase(
				appeal.id,
				addDocumentsRequest.blobStorageHost,
				addDocumentsRequest.blobStorageContainer,
				addDocumentsRequest.documents
			);
			mappedReq.forEach((m) => {
				expect(m.blobStorageHost).toEqual(addDocumentsRequest.blobStorageHost);
				expect(m.blobStorageContainer).toEqual(addDocumentsRequest.blobStorageContainer);
			});

			const prismaMock = {
				document: {
					create: jest.fn().mockResolvedValue(documentCreated),
					update: jest.fn().mockResolvedValue(documentUpdated)
				},
				documentVersion: {
					upsert: jest.fn().mockResolvedValue(documentVersionCreated),
					findFirst: jest.fn().mockResolvedValue(documentVersionRetrieved)
				}
			};

			databaseConnector.$transaction = jest
				.fn()
				.mockImplementation((callback) => callback(prismaMock));
			const response = await service.addDocumentsToAppeal(addDocumentsRequest, appeal);
			expect(response).toEqual({ documents: [blobInfo] });
		});

		test('post new document version', async () => {
			const mappedReq = mappers.mapDocumentsForDatabase(
				appeal.id,
				addDocumentVersionRequest.blobStorageHost,
				addDocumentVersionRequest.blobStorageContainer,
				[addDocumentVersionRequest.document]
			);
			mappedReq.forEach((m) => {
				expect(m.blobStorageHost).toEqual(addDocumentVersionRequest.blobStorageHost);
				expect(m.blobStorageContainer).toEqual(addDocumentVersionRequest.blobStorageContainer);
			});

			const prismaMock = {
				document: {
					findFirst: jest.fn().mockResolvedValue(documentCreated),
					update: jest.fn().mockResolvedValue(documentUpdated)
				},
				documentVersion: {
					upsert: jest.fn().mockResolvedValue(documentVersionCreated),
					findFirst: jest.fn().mockResolvedValue(documentVersionRetrieved)
				}
			};

			databaseConnector.$transaction = jest
				.fn()
				.mockImplementation((callback) => callback(prismaMock));

			const response = await service.addVersionToDocument(
				addDocumentVersionRequest,
				appeal,
				documentCreated.guid
			);
			expect(response).toEqual({ documents: [blobInfo] });
		});
	});

	describe('documents services', () => {
		test('get folders for appeal', async () => {
			databaseConnector.folder.findMany.mockReturnValue([folder]);
			const folders = await service.getFoldersForAppeal(appeal, 'appellantCase');
			expect(folders).toEqual([folder]);
		});
	});
});
