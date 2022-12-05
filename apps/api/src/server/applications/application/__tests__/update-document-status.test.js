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

const updateStatusInDocumentTableStub = sinon.stub().returns(document1);

const findUniqueGUIDInDocumentTableStub = sinon.stub();

const findCaseIdInFolderTableStub = sinon.stub().returns({
	id: 1,
	displayNameEn: 'displayName',
	displayOrder: 'displayOrder',
	parentFolderId: 'parentFolderId',
	caseId: 1
});

findUniqueGUIDInDocumentTableStub.withArgs({ where: { guid: 'D1234' } }).returns({
	guid: 'D1234',
	name: 'Tom',
	folderId: 2,
	blobStorageContainer: 'Container',
	blobStoragePath: 'Container',
	status: 'awaiting_upload'
});

findUniqueGUIDInDocumentTableStub.withArgs({ where: { guid: 'D12345' } }).returns(null);

test.before('set up mocks', () => {
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
	sinon.assert.calledWith(updateStatusInDocumentTableStub, {
		where: { guid: 'D1234' },
		data: {
			status: 'not_yet_checked'
		}
	});
});

test('throws error if guid does not exist in database', async (t) => {
	const response = await request
		.patch('/applications/1/documents/D12345/status')
		.send({ status: 'uploading' });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			documentGUID: 'DocumentGUID must exist in database'
		}
	});
});

test("throws error if guid doesn't belong to case provided", async (t) => {
	const response = await request
		.patch('/applications/3/documents/D1234/status')
		.send({ status: 'uploading' });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			documentGUID: 'GUID must belong to correct case'
		}
	});
});

test('throws erorr if incorrect machine action', async (t) => {
	const response = await request.patch('/applications/1/documents/D1234/status').send({
		machineAction: 'wrong-action'
	});

	t.is(response.status, 409);
	t.deepEqual(response.body, {
		errors: {
			application: "Could not transition 'awaiting_upload' using 'wrong-action'."
		}
	});
});

test("throws errorr if incorrect machine action given the document's current state", async (t) => {
	const response = await request.patch('/applications/1/documents/D1234/status').send({
		machineAction: 'check_fail'
	});

	t.is(response.status, 409);
	t.deepEqual(response.body, {
		errors: {
			application: "Could not transition 'awaiting_upload' using 'check_fail'."
		}
	});
});

test('throws error if no machine action provided', async (t) => {
	const response = await request.patch('/applications/1/documents/D1234/status').send();

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			machineAction: 'Please provide a value for machine action'
		}
	});
});
