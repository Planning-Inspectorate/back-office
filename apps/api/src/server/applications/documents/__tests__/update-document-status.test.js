import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
// import { databaseConnector } from '../../../utils/database-connector.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const document1 = {
	caseId: 1,
	guid: 'D1234',
	status: 'awaiting_virus_check'
};

const updateStatusInDocumentTableStub = sinon.stub().returns(document1);

const findUniqueGUIDInDocumentTableStub = sinon.stub();

const findCaseIdInFolderTableStub = sinon.stub().returns({
	id: 1,
	displayNameEn: 'displayName',
	displayOrder: 'displayOrder',
	parentFolderId: 'parentFolderId',
	caseId: 1
});

findUniqueGUIDInDocumentTableStub
	.withArgs({
		where: {
			guid: 'D1234'
		}
	})
	.returns({
		guid: 'D1234',
		name: 'Tom',
		folderId: 2,
		blobStorageContainer: 'Container',
		blobStoragePath: 'Container',
		status: 'awaiting_upload'
	});

findUniqueGUIDInDocumentTableStub
	.withArgs({ where: { guid: 'D12345', isDeleted: false } })
	.returns(null);

describe('Update document status', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'folder').get(() => {
			return { findUnique: findCaseIdInFolderTableStub };
		});

		sinon.stub(databaseConnector, 'document').get(() => {
			return {
				findUnique: findUniqueGUIDInDocumentTableStub,
				update: updateStatusInDocumentTableStub
			};
		});
	});

	test('updates document status', async () => {
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'uploading'
		});

		expect(response.status).toEqual(200);
		expect(response.body).toEqual({
			caseId: 1,
			guid: 'D1234',
			status: 'awaiting_virus_check'
		});
		sinon.assert.calledWith(updateStatusInDocumentTableStub, {
			where: { guid: 'D1234' },
			data: {
				status: 'awaiting_virus_check'
			}
		});
	});

	test('throws erorr if incorrect machine action', async () => {
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'wrong-action'
		});

		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				application: "Could not transition 'awaiting_upload' using 'wrong-action'."
			}
		});
	});

	test("throws errorr if incorrect machine action given the document's current state", async () => {
		const response = await request.patch('/applications/documents/D1234/status').send({
			machineAction: 'check_fail'
		});

		expect(response.status).toEqual(409);
		expect(response.body).toEqual({
			errors: {
				application: "Could not transition 'awaiting_upload' using 'check_fail'."
			}
		});
	});

	test('throws error if no machine action provided', async () => {
		const response = await request.patch('/applications/documents/D1234/status').send();

		expect(response.status).toEqual(400);
		expect(response.body).toEqual({
			errors: {
				machineAction: 'Please provide a value for machine action'
			}
		});
	});
});
