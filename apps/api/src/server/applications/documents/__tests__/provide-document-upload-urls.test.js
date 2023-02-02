import test from 'ava';
import { got } from 'got';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const application = {
	id: 1,
	reference: 'case reference'
};

const findUniqueStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).returns(application);

const findUniqueFolderStub = sinon.stub();

findUniqueFolderStub.withArgs({ where: { id: 1 } }).returns({ id: 1, caseId: 1 });

const upsertDocumentStub = sinon.stub();

upsertDocumentStub
	.withArgs({
		create: { name: 'test doc', folderId: 1, fileSize: 1000, fileType: 'application/json' },
		where: { name_folderId: { name: 'test doc', folderId: 1 } },
		update: {}
	})
	.returns({
		id: 1,
		guid: 'some-guid',
		name: 'test doc',
		folderId: 1,
		fileSize: 1000,
		fileType: 'application/json'
	});

const postStub = sinon
	.stub()
	.withArgs('https://api-document-storage-host:doc-storage-port/document-location', {
		json: [
			{
				caseType: 'application',
				caseReference: 'case reference',
				GUID: 'some-guid',
				documentName: 'test doc'
			}
		]
	})
	.returns({
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

const updateDocumentStub = sinon.stub();

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});

	sinon.stub(databaseConnector, 'folder').get(() => {
		return { findUnique: findUniqueFolderStub };
	});

	sinon.stub(databaseConnector, 'document').get(() => {
		return { upsert: upsertDocumentStub, update: updateDocumentStub };
	});

	sinon.stub(got, 'post').callsFake(postStub);

	process.env.DOCUMENT_STORAGE_API_HOST = 'api-document-storage-host';
	process.env.DOCUMENT_STORAGE_API_PROT = 'doc-storage-port';
});

test('saves documents information and returns upload URL', async (t) => {
	const response = await request.post('/applications/1/documents').send([
		{
			folderId: 1,
			documentName: 'test doc',
			documentSize: 1000,
			documentType: 'application/json'
		}
	]);

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		blobStorageHost: 'blob-store-host',
		blobStorageContainer: 'blob-store-container',
		documents: [
			{
				documentName: 'test doc',
				blobStoreUrl: '/some/path/test doc'
			}
		]
	});

	sinon.assert.calledWith(updateDocumentStub, {
		where: {
			guid: 'some-guid'
		},
		data: {
			blobStorageContainer: 'blob-store-container',
			blobStoragePath: '/some/path/test doc'
		}
	});
});

test('throws error if folder id does not belong to case', async (t) => {
	const response = await request.post('/applications/1/documents').send([
		{
			folderId: 2,
			documentName: 'test doc',
			documentSize: 1000,
			documentType: 'application/json'
		}
	]);

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'[0].folderId': 'Folder must belong to case'
		}
	});
});

test('throws error if not all document details provided', async (t) => {
	const response = await request.post('/applications/1/documents').send([{}]);

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'[0].documentName': 'Must provide a document name',
			'[0].documentSize': 'Must provide a document size',
			'[0].documentType': 'Must provide a document type',
			'[0].folderId': 'Must provide a folder id'
		}
	});
});

test('throws error if no documents provided', async (t) => {
	const response = await request.post('/applications/1/documents').send([]);

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: {
			'': 'Must provide documents to upload'
		}
	});
});

test('checks invalid case id', async (t) => {
	const response = await request.post('/applications/2/documents');

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: {
			id: 'Must be an existing application'
		}
	});
});
