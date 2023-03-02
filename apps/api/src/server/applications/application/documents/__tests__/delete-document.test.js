const { databaseConnector } = await import('../../../../utils/database-connector.js');

import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../../app.js';
import { applicationStates } from '../../../state-machine/application.machine.js';

const request = supertest(app);

describe('delete Document', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('The test case involves deleting a document setting its "isDeleted" property to "true".', async () => {
		// GIVEN
		databaseConnector.document.findFirst.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my_doc.doc',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
			status: applicationStates.draft,
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true
		});

		const isDeleted = true;

		// WHEN
		const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({ isDeleted });
		expect(databaseConnector.document.findFirst).toHaveBeenCalledWith({
			include: {
				documentMetadata: true
			},
			where: {
				guid: '1111-2222-3333',
				isDeleted: false,
				folder: {
					caseId: 1
				}
			}
		});

		expect(databaseConnector.document.delete).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333'
			}
		});
	});

	test('should fail to delete document because document is published', async () => {
		// GIVEN
		databaseConnector.document.findFirst.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my_doc.doc',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
			status: applicationStates.published,
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true
		});

		// WHEN
		const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: 'unable to delete document guid 1111-2222-3333 related to casedId 1'
		});
	});

	test('should fail if document is not found', async () => {
		// GIVEN
		databaseConnector.document.findFirst.mockResolvedValue(null);

		// WHEN
		const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

		// THEN
		expect(response.status).toEqual(404);

		expect(response.body).toEqual({
			errors: 'document not found guid 1111-2222-3333 related to casedId 1'
		});
	});
});
