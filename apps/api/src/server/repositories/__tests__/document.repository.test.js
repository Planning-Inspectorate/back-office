import { jest } from '@jest/globals';
import {
	create,
	getById,
	getByCaseId,
	getDocumentsInFolder,
	deleteDocument
} from '../document.repository.js';
const { databaseConnector } = await import('#utils/database-connector.js');

// jest.mock('#utils/database-connector.js');

describe('Document Repository', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('create', () => {
		it('creates a new document successfully', async () => {
			const mockDocument = { guid: '123', name: 'Test Document' };
			databaseConnector.document.create.mockResolvedValue(mockDocument);

			const result = await create(mockDocument);

			expect(databaseConnector.document.create).toHaveBeenCalledWith({ data: mockDocument });
			expect(result).toEqual(mockDocument);
		});

		it('throws an error when creation fails', async () => {
			const mockDocument = { guid: '123', name: 'Test Document' };
			databaseConnector.document.create.mockRejectedValue(new Error('Database error'));

			await expect(create(mockDocument)).rejects.toThrow('Database error');
		});
	});

	describe('getById', () => {
		it('retrieves a document by its guid', async () => {
			const mockDocument = { guid: '123', name: 'Test Document' };
			databaseConnector.document.findUnique.mockResolvedValue(mockDocument);

			const result = await getById('123');

			expect(databaseConnector.document.findUnique).toHaveBeenCalledWith({
				where: { guid: '123' }
			});
			expect(result).toEqual(mockDocument);
		});

		it('returns null if no document is found', async () => {
			databaseConnector.document.findUnique.mockResolvedValue(null);

			const result = await getById('non-existent-guid');

			expect(databaseConnector.document.findUnique).toHaveBeenCalledWith({
				where: { guid: 'non-existent-guid' }
			});
			expect(result).toBeNull();
		});
	});

	describe('getByCaseId', () => {
		it('retrieves documents by caseId with pagination', async () => {
			const mockDocuments = [{ guid: '123' }, { guid: '456' }];
			databaseConnector.document.findMany.mockResolvedValue(mockDocuments);

			const result = await getByCaseId({ caseId: 1, skipValue: 0, pageSize: 10 });

			expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
				where: { caseId: 1, isDeleted: false },
				skip: 0,
				take: 10,
				orderBy: [{ createdAt: 'desc' }]
			});
			expect(result).toEqual(mockDocuments);
		});

		it('returns an empty array if no documents are found', async () => {
			databaseConnector.document.findMany.mockResolvedValue([]);

			const result = await getByCaseId({ caseId: 1, skipValue: 0, pageSize: 10 });

			expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
				where: { caseId: 1, isDeleted: false },
				skip: 0,
				take: 10,
				orderBy: [{ createdAt: 'desc' }]
			});
			expect(result).toEqual([]);
		});
	});

	describe('getDocumentsInFolder', () => {
		it('retrieves documents in a folder', async () => {
			const mockDocuments = [{ guid: '123' }, { guid: '456' }];
			databaseConnector.document.findMany.mockResolvedValue(mockDocuments);

			const result = await getDocumentsInFolder(1);

			expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
				include: {
					documentVersion: true,
					latestDocumentVersion: true,
					folder: true
				},
				where: { folderId: 1, isDeleted: false },
				orderBy: { createdAt: 'desc' }
			});
			expect(result).toEqual(mockDocuments);
		});

		it('returns an empty array if no documents are found in the folder', async () => {
			databaseConnector.document.findMany.mockResolvedValue([]);

			const result = await getDocumentsInFolder(1);

			expect(databaseConnector.document.findMany).toHaveBeenCalledWith({
				include: {
					documentVersion: true,
					latestDocumentVersion: true,
					folder: true
				},
				where: { folderId: 1, isDeleted: false },
				orderBy: { createdAt: 'desc' }
			});
			expect(result).toEqual([]);
		});
	});

	describe('deleteDocument', () => {
		it('deletes a document by its guid', async () => {
			const mockDocument = { guid: '123', name: 'Test Document' };
			databaseConnector.document.delete.mockResolvedValue(mockDocument);

			const result = await deleteDocument('123');

			expect(databaseConnector.document.delete).toHaveBeenCalledWith({ where: { guid: '123' } });
			expect(result).toEqual(mockDocument);
		});

		it('throws an error when deletion fails', async () => {
			databaseConnector.document.delete.mockRejectedValue(new Error('Database error'));

			await expect(deleteDocument('123')).rejects.toThrow('Database error');
		});
	});
});
