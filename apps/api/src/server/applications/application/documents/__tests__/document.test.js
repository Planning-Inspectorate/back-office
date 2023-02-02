import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../../app.js';
import { databaseConnector } from '../../../../utils/database-connector.js';

const request = supertest(app);

const application = {
	id: 1,
	reference: 'case reference'
};

const findUniqueStub = sinon.stub();
const updateDocumentStub = sinon.stub().returns([{ guid: '1111-2222-3333' }]);
const findUniqueDocumentStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).returns(application);

findUniqueDocumentStub.withArgs({ where: { guid: '1111-2222-3333' } }).returns({
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

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});

	sinon.stub(databaseConnector, 'document').get(() => {
		return { findUnique: findUniqueDocumentStub, update: updateDocumentStub };
	});
});

test('updates document setting status and redacted status', async (t) => {
	const response = await request
		.patch('/applications/1/documents/update')
		.send({ status: 'not_user_checked', redacted: true, items: [{ guid: '1111-2222-3333' }] });

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			guid: '1111-2222-3333'
		}
	]);

	sinon.assert.calledWith(updateDocumentStub, {
		where: {
			guid: '1111-2222-3333'
		},
		data: {
			redacted: true,
			status: 'not_user_checked'
		}
	});
});

test('throws error if document id does not exist', async (t) => {
	const response = await request
		.patch('/applications/1/documents/update')
		.send({ status: 'not_user_checked', redacted: true, items: [{ guid: 'xxxxx' }] });

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			items: 'Unknown document guid xxxxx'
		}
	});
});

test('throws error if no document ids are specified', async (t) => {
	const response = await request
		.patch('/applications/1/documents/update')
		.send([{ status: 'not_user_checked' }]);

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			items: 'No document guids specified'
		}
	});
});

test('checks invalid case id', async (t) => {
	const response = await request
		.patch('/applications/2/documents/update')
		.send([{ status: 'not_user_checked', items: [{ guid: 'xxxxx' }] }]);

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});

test('returns document properties for a single document on a case', async (t) => {
	const response = await request.get('/applications/1/documents/1111-2222-3333');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
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

test('checks invalid case id on Blob Storage URI call', async (t) => {
	const response = await request.get('/applications/999999/documents/1111-2222-3333');

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});
