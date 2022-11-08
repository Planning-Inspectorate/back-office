import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application = {
	id: 1
};

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).returns(application);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});
});

test('saves documents information and returns upload URL', async (t) => {
	const response = await request.post('/applications/1/document');

	t.is(response.status, 200);
});

test('throws error if folder id does not belong to case', async (t) => {
	const response = await request
		.post('/applications/1/document')
		.send([{ folderId: 2, documentName: 'test doc' }]);

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'[0].folderId': 'Folder must belong to case'
		}
	});
});

test('throws error if not all document details provided', async (t) => {
	const response = await request.post('/applications/1/document').send([{}]);

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'[0].documentName': 'Must provide a document name',
			'[0].folderId': 'Must provide a folder id'
		}
	});
});

test('throws error if no documents provided', async (t) => {
	const response = await request.post('/applications/1/document').send([]);

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'': 'Must provide documents to upload'
		}
	});
});

test('checks invalid case id', async (t) => {
	const response = await request.post('/applications/2/document');

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});
