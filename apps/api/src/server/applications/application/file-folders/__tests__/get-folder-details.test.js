import test from 'ava';
import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../../app.js';
import { applicationFactoryForTests } from '../../../../utils/application-factory-for-tests.js';
import { databaseConnector } from '../../../../utils/database-connector.js';

const request = supertest(app);

const application1 = applicationFactoryForTests({
	id: 1,
	title: 'EN010003 - NI Case 3 Name',
	description: 'EN010003 - NI Case 3 Name Description',
	caseStatus: 'pre-application'
});
const application2 = applicationFactoryForTests({
	id: 2,
	title: 'EN010004 - Case 2',
	description: 'EN010004 - NI Case 2',
	caseStatus: 'pre-application'
});

const folder1 = {
	id: 201,
	displayNameEn: 'Sub Folder 1',
	displayOrder: 100,
	parentFolderId: 20,
	caseId: 1
};

const level1Folders = [
	{
		id: 1,
		displayNameEn: 'Project documentation',
		displayOrder: 100,
		parentFolderId: null,
		caseId: 1
	},
	{
		id: 2,
		displayNameEn: 'Legal advice',
		displayOrder: 200,
		parentFolderId: null,
		caseId: 1
	}
];

const subFolders = [
	{
		id: 101,
		displayNameEn: 'Sub Folder 1',
		displayOrder: 100,
		parentFolderId: 201,
		caseId: 1
	},
	{
		id: 102,
		displayNameEn: 'Sub Folder 2',
		displayOrder: 200,
		parentFolderId: 201,
		caseId: 1
	}
];

const documents = [
	{
		guid: '1111-2222-3333',
		name: 'Document 1',
		folderId: 201,
		status: 'not_user_checked',
		blobStorageContainer: null,
		blobStoragePath: null,
		redacted: false,
		createdAt: new Date(1_658_486_313_000)
	}
];

const findUniqueStub = sinon.stub();
const findUniqueFolderStub = sinon.stub();
const findManyFoldersStub = sinon.stub();
const findManyDocumentsStub = sinon.stub();
const countStub = sinon.stub();
const documentsInFolder201Count = 1;

findUniqueStub.withArgs({ where: { id: 1 } }).returns(application1);
findUniqueStub.withArgs({ where: { id: 2 } }).returns(application2);

findManyFoldersStub.withArgs({ where: { caseId: 1, parentFolderId: null } }).returns(level1Folders);
findManyFoldersStub.withArgs({ where: { caseId: 1, parentFolderId: 201 } }).returns(subFolders);

findUniqueFolderStub.withArgs({ where: { caseId: 1, folderId: 201 } }).returns(folder1);
// this is needed for the internal custom is folder on the case check
findUniqueFolderStub.withArgs({ where: { id: 201 } }).returns(folder1);

findManyDocumentsStub
	.withArgs({
		skip: sinon.match.any,
		take: sinon.match.any,
		orderBy: [{ createdAt: 'desc' }],
		where: { folderId: 201 }
	})
	.returns(documents);

countStub
	.withArgs({
		where: { folderId: 201 }
	})
	.returns(documentsInFolder201Count);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});
	sinon.stub(databaseConnector, 'folder').get(() => {
		return { findMany: findManyFoldersStub, findUnique: findUniqueFolderStub };
	});
	sinon.stub(databaseConnector, 'document').get(() => {
		return {
			findMany: findManyDocumentsStub,
			count: countStub
		};
	});
});

test('returns level 1 folders for a case when id is valid', async (t) => {
	const response = await request.get('/applications/1/folders');

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			id: 1,
			displayNameEn: 'Project documentation',
			displayOrder: 100
		},
		{
			id: 2,
			displayNameEn: 'Legal advice',
			displayOrder: 200
		}
	]);
});

test('returns a single folder on a case', async (t) => {
	const response = await request.get('/applications/1/folders/201');

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		displayNameEn: 'Sub Folder 1',
		displayOrder: 100,
		id: 201
	});
});

test('returns the sub folders for a folder on a case', async (t) => {
	const response = await request.get('/applications/1/folders/201/sub-folders');

	t.is(response.status, 200);
	t.deepEqual(response.body, [
		{
			id: 101,
			displayNameEn: 'Sub Folder 1',
			displayOrder: 100
		},
		{
			id: 102,
			displayNameEn: 'Sub Folder 2',
			displayOrder: 200
		}
	]);
});

test('returns 400 error if sub folder id is not a folder on a case', async (t) => {
	const response = await request.get('/applications/1/folders/1000/sub-folders');

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: { folderId: 'Must be an existing folder that belongs to this case' }
	});
});

// File tests
test('returns 400 error getting documents if sub folder id is not a folder on a case', async (t) => {
	const response = await request.post('/applications/1/folders/1000/documents').send({
		pageNumber: 1,
		pageSize: 1
	});

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: { folderId: 'Must be an existing folder that belongs to this case' }
	});
});

test('returns 400 error getting documents if sub folder id is valid but not a folder on this case', async (t) => {
	const response = await request.post('/applications/2/folders/201/documents').send({
		pageNumber: 1,
		pageSize: 1
	});

	t.is(response.status, 400);
	t.deepEqual(response.body, {
		errors: { folderId: 'Must be an existing folder that belongs to this case' }
	});
});

test('returns 404 error getting documents if case does not exist', async (t) => {
	const response = await request.post('/applications/1000/folders/1/documents').send({
		pageNumber: 1,
		pageSize: 1
	});

	t.is(response.status, 404);
	t.deepEqual(response.body, {
		errors: { id: 'Must be an existing application' }
	});
});

test('returns documents in a folder on a case', async (t) => {
	const response = await request.post('/applications/1/folders/201/documents').send({
		pageNumber: 1,
		pageSize: 50
	});

	t.is(response.status, 200);
	t.deepEqual(response.body, {
		page: 1,
		pageDefaultSize: 50,
		pageCount: 1,
		itemCount: 1,
		items: [
			{
				guid: '1111-2222-3333',
				documentName: 'Document 1',
				documentUrl: null,
				from: '',
				receivedDate: '2022-07-22T10:38:33.000Z',
				size: 0,
				type: '',
				redacted: false,
				status: 'not_user_checked'
			}
		]
	});
});
