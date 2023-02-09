import supertest from 'supertest';
import { app } from '../../../../app.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const request = supertest(app);

const application = {
	id: 1,
	reference: 'case reference'
};

describe('Update Document', () => {
	test('updates document setting status and redacted status', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my doc.pdf',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my doc.pdf',
			status: 'awaiting_upload',
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true,
			fileSize: 1024,
			fileType: 'application/pdf'
		});

		// WHEN
		const response = await request
			.patch('/applications/1/documents/update')
			.send({ status: 'not_user_checked', redacted: true, items: [{ guid: '1111-2222-3333' }] });

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual([
			{
				guid: '1111-2222-3333'
			}
		]);

		expect(databaseConnector.document.update).toHaveBeenCalledWith({
			where: {
				guid: '1111-2222-3333'
			},
			data: {
				redacted: true,
				status: 'not_user_checked'
			}
		});
	});

	test('throws error if document id does not exist', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request
			.patch('/applications/1/documents/update')
			.send({ status: 'not_user_checked', redacted: true, items: [{ guid: 'xxxxx' }] });

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				items: 'Unknown document guid xxxxx'
			}
		});
	});

	test('throws error if no document ids are specified', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request
			.patch('/applications/1/documents/update')
			.send([{ status: 'not_user_checked' }]);

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				items: 'No document guids specified'
			}
		});
	});

	test('checks invalid case id', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request
			.patch('/applications/2/documents/update')
			.send([{ status: 'not_user_checked', items: [{ guid: 'xxxxx' }] }]);

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});

	test('returns document properties for a single document on a case', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(application);
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: '1111-2222-3333',
			name: 'my doc.pdf',
			folderId: 1,
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my doc.pdf',
			status: 'awaiting_upload',
			createdAt: '2022-12-12 17:12:25.9610000',
			redacted: true,
			fileSize: 1024,
			fileType: 'application/pdf'
		});

		// WHEN
		const response = await request.get('/applications/1/documents/1111-2222-3333');

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			guid: '1111-2222-3333',
			documentName: 'my doc.pdf',
			blobStorageContainer: 'document-service-uploads',
			blobStoragePath: '/application/BC010001/1111-2222-3333/my doc.pdf',
			from: '',
			receivedDate: 1_670_865_145,
			size: 1024,
			type: 'application/pdf',
			redacted: true,
			status: 'awaiting_upload',
			description: '',
			documentReferenceNumber: '',
			version: 1,
			agent: '',
			caseStage: '',
			webFilter: '',
			documentType: ''
		});
	});

	test('checks invalid case id on document properties call', async () => {
		// GIVEN
		databaseConnector.case.findUnique.mockResolvedValue(null);

		// WHEN
		const response = await request.get('/applications/999999/documents/1111-2222-3333');

		// THEN
		expect(response.status).toEqual(404);
		expect(response.body).toEqual({
			errors: {
				id: 'Must be an existing application'
			}
		});
	});
});
