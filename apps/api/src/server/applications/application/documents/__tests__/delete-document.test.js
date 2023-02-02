import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../../app.js';
import { databaseConnector } from '../../../../utils/database-connector.js';
import { DOCUMENT_STATUS } from '../../../../utils/document-enum.js';

const request = supertest(app);

const application = {
	id: 1,
	reference: 'case reference'
};

const sandbox = sinon.createSandbox();

/** @type {import('sinon').SinonStub<any, Promise<any>>} */
const findUniqueStub = sandbox.stub();

/** @type {import('sinon').SinonStub<any, Promise<any>>} */
const updateDocumentStub = sandbox.stub().resolves([{ guid: '1111-2222-3333' }]);

/** @type {import('sinon').SinonStub<any, Promise<any>>} */
const findUniqueDocumentStub = sandbox.stub();

/** @type {import('sinon').SinonStub<any, Promise<any>>} */
const findFirstDocumentStub = sandbox.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).resolves(application);

sandbox.stub(databaseConnector, 'case').get(() => {
	return { findUnique: findUniqueStub };
});

sandbox.stub(databaseConnector, 'document').get(() => {
	return {
		findUnique: findUniqueDocumentStub,
		update: updateDocumentStub,
		findFirst: findFirstDocumentStub
	};
});

test.afterEach.always(() => {
	sandbox.reset();
	sandbox.resetBehavior();
});

test.serial('updates document setting isDeleted to true', async (t) => {
	findFirstDocumentStub.resolves({
		guid: '1111-2222-3333',
		name: 'my_doc.doc',
		folderId: 1,
		blobStorageContainer: 'document-service-uploads',
		blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
		status: DOCUMENT_STATUS.UNPUBLISHED,
		createdAt: '2022-12-12 17:12:25.9610000',
		redacted: true
	});

	const isDeleted = true;

	const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

	t.is(response.status, 200);

	t.deepEqual(response.body, {
		isDeleted
	});

	findFirstDocumentStub.calledWith({
		where: {
			guid: '1111-2222-3333',
			isDeleted: false,
			folder: {
				caseId: 1
			}
		}
	});

	updateDocumentStub.calledWith({
		where: {
			guid: '1111-2222-3333'
		},
		data: {
			isDeleted
		}
	});
});

test.serial('should fail to update document because document is published', async (t) => {
	findFirstDocumentStub.resolves({
		guid: '1111-2222-3333',
		name: 'my_doc.doc',
		folderId: 1,
		blobStorageContainer: 'document-service-uploads',
		blobStoragePath: '/application/BC010001/1111-2222-3333/my_doc.doc',
		status: DOCUMENT_STATUS.PUBLISHED,
		createdAt: '2022-12-12 17:12:25.9610000',
		redacted: true
	});

	const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

	t.is(response.status, 400);

	t.deepEqual(response.body, {
		errors: 'unable to archive document guid 1111-2222-3333 related to casedId 1'
	});
});

test.serial('should fail and return 404 error', async (t) => {
	findFirstDocumentStub.resolves(null);

	const response = await request.post('/applications/1/documents/1111-2222-3333/delete').send({});

	t.is(response.status, 404);
});
