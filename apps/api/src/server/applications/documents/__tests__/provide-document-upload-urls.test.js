const { default: got } = await import('got');

import supertest from 'supertest';
import { app } from '../../../app.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const application = {
	id: 1,
	reference: 'case reference'
};

describe('Provide document upload URLs', () => {
	beforeAll(() => {
		process.env.DOCUMENT_STORAGE_API_HOST = 'api-document-storage-host';
		process.env.DOCUMENT_STORAGE_API_PROT = 'doc-storage-port';
	});

	test('saves documents information and returns upload URL', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 1 });
		got.post.mockResolvedValue({
			json: () => {
				return {
					blobStorageHost: 'blob-store-host',
					blobStorageContainer: 'blob-store-container',
					documents: [
						{
							caseType: 'application',
							blobStoreUrl: '/some/path/test doc',
							caseReference: 'test reference',
							GUID: 'some-guid',
							documentName: 'test doc'
						}
					]
				};
			}
		});

		// WHEN
		const response = await request.post('/applications/1/documents').send([
			{
				folderId: 1,
				documentName: 'test doc',
				documentSize: 1000,
				documentType: 'application/json'
			}
		]);

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			blobStorageHost: 'blob-store-host',
			blobStorageContainer: 'blob-store-container',
			documents: [
				{
					documentName: 'test doc',
					blobStoreUrl: '/some/path/test doc'
				}
			]
		});

		expect(databaseConnector.document.update).toHaveBeenCalledWith({
			where: {
				guid: 'some-guid'
			},
			data: {
				blobStorageContainer: 'blob-store-container',
				blobStoragePath: '/some/path/test doc'
			}
		});
	});

	test('throws error if folder id does not belong to case', async () => {
		// GIVEN
		databaseConnector.folder.findUnique.mockResolvedValue({ caseId: 2 });

		// WHEN
		const response = await request.post('/applications/1/documents').send([
			{
				folderId: 2,
				documentName: 'test doc',
				documentSize: 1000,
				documentType: 'application/json'
			}
		]);

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'[0].folderId': 'Folder must belong to case'
			}
		});
	});

	test('throws error if not all document details provided', async () => {
		// GIVEN

		// WHEN
		const response = await request.post('/applications/1/documents').send([{}]);

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'[0].documentName': 'Must provide a document name',
				'[0].documentSize': 'Must provide a document size',
				'[0].documentType': 'Must provide a document type',
				'[0].folderId': 'Must provide a folder id'
			}
		});
	});

	test('throws error if no documents provided', async () => {
		// GIVEN

		// WHEN
		const response = await request.post('/applications/1/documents').send([]);

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				'': 'Must provide documents to upload'
			}
		});
	});

	test('checks invalid case id', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.post('/applications/2/documents');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});
});
