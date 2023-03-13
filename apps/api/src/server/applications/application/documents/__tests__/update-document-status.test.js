import supertest from 'supertest';
import { app } from '../../../../app.js';
const { databaseConnector } = await import('../../../../utils/database-connector.js');

const request = supertest(app);

const document1 = {
	caseId: 1,
	documentGuid: 'D1234',
	publishedStatus: 'awaiting_virus_check'
};

describe('Update document status', () => {
	test('updates document status', async () => {
		// GIVEN
		databaseConnector.document.findUnique.mockResolvedValue({
			guid: 'D1234',
			name: 'Tom',
			folderId: 2,
			blobStorageContainer: 'Container',
			blobStoragePath: 'Container',
			status: 'awaiting_upload'
		});
		databaseConnector.folder.findUnique.mockResolvedValue({
			caseId: 1
		});
		databaseConnector.documentVersion.update.mockResolvedValue(document1);

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'uploading'
		});

		// THEN
		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			caseId: 1,
			guid: 'D1234',
			status: 'awaiting_virus_check'
		});
		expect(databaseConnector.documentVersion.update).toHaveBeenCalledWith({
			where: { documentGuid_version: { documentGuid: 'D1234', version: 1 } },
			data: {
				publishedStatus: 'awaiting_virus_check'
			}
		});
	});

	test('throws erorr if incorrect machine action', async () => {
		// GIVEN

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'wrong-action'
		});

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				application: "Could not transition 'awaiting_upload' using 'wrong-action'."
			}
		});
	});

	test("throws errorr if incorrect machine action given the document's current state", async () => {
		// GIVEN

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'check_fail'
		});

		// THEN
		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				application: "Could not transition 'awaiting_upload' using 'check_fail'."
			}
		});
	});

	test('throws error if no machine action provided', async () => {
		// GIVEN

		// WHEN
		const response = await request.patch('/applications/documents/D1234/status').send();

		// THEN
		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				machineAction: 'Please provide a value for machine action'
			}
		});
	});
});
