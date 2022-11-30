import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const document1 = {
	caseId: 1,
	guid: 'D1234',
	status: 'not_yet_checked'
};

const updateStub = sinon.stub().returns(document1);

const findUniqueStub = sinon.stub();

const folderStub = sinon.stub().returns({
	id: 1,
	displayNameEn: 'displayName',
	displayOrder: 'displayOrder',
	parentFolderId: 'parentFolderId',
	caseId: 1
});

findUniqueStub.withArgs({ where: { guid: 'D1234' } }).returns({
	guid: 'D1234',
	name: 'Tom',
	folderId: 2,
	blobStorageContainer: 'Container',
	blobStoragePath: 'Container',
	status: 'awaiting_upload'
});

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'folder').get(() => {
		return { findUnique: folderStub };
	});

	sinon.stub(databaseConnector, 'document').get(() => {
		return { findUnique: findUniqueStub, update: updateStub };
	});
});

test('updates document status', async (t) => {
	const response = await request.patch('/applications/1/documents/D1234/status').send({
		machineAction: 'uploading'
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		caseId: 1,
		guid: 'D1234',
		status: 'not_yet_checked'
	});
	sinon.assert.calledWith(updateStub, {
		where: { guid: 'D1234' },
		data: {
			status: 'not_yet_checked'
		}
	});
});

test("throws error if guid doesn't belong to case provided", async (t) => {
	const response = await request
		.patch('/applications/2/documents/D12345/status')
		.send({ status: 'uploading' });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			documentGUID: 'Document must have correct GUID'
		}
	});
});
