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
	caseStatus: 'draft'
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

const findUniqueStub = sinon.stub();
const findUniqueFolderStub = sinon.stub();
const findManyFoldersStub = sinon.stub();

findUniqueStub.withArgs({ where: { id: 1 } }).returns(application1);

findManyFoldersStub.withArgs({ where: { caseId: 1, parentFolderId: null } }).returns(level1Folders);
findManyFoldersStub.withArgs({ where: { caseId: 1, parentFolderId: 201 } }).returns(subFolders);

findUniqueFolderStub.withArgs({ where: { caseId: 1, folderId: 201 } }).returns(folder1);
// this is needed for the internal custom is folder on the case check
findUniqueFolderStub.withArgs({ where: { id: 201 } }).returns(folder1);

test.before('set up mocks', () => {
	sinon.stub(databaseConnector, 'case').get(() => {
		return { findUnique: findUniqueStub };
	});
	sinon.stub(databaseConnector, 'folder').get(() => {
		return { findMany: findManyFoldersStub, findUnique: findUniqueFolderStub };
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
});
