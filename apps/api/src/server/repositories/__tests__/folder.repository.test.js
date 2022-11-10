import test from 'ava';
import sinon from 'sinon';
import { databaseConnector } from '../../utils/database-connector.js';
import * as folderRepository from '../folder.repository.js';

const findManyStub = sinon.stub();
const findUniqueStub = sinon.stub();

const existingLevel1Folders = [
	{
		id: 1,
		displayNameEn: 'test level 1 folder',
		displayOrder: 100,
		parentFolderId: null,
		caseId: 1
	}
];

const existingSubFolders = [
	{ id: 2, displayNameEn: 'test sub folder', displayOrder: 100, parentFolderId: 14, caseId: 2 }
];
const singleFolder = {
	id: 15,
	displayNameEn: 'test folder',
	displayOrder: 100,
	parentFolderId: null,
	caseId: 4
};

const folderPath = [
	{
		id: 1,
		displayNameEn: 'Top level folder',
		displayOrder: 100,
		parentFolderId: null,
		caseId: 5
	},
	{
		id: 2,
		displayNameEn: '2nd level folder',
		displayOrder: 100,
		parentFolderId: 1,
		caseId: 5
	}
];

findManyStub
	.withArgs({ where: { caseId: 1, parentFolderId: null } })
	.returns(existingLevel1Folders);
findManyStub.withArgs({ where: { caseId: 2, parentFolderId: 14 } }).returns(existingSubFolders);
findManyStub.withArgs({ where: { caseId: 3, parentFolderId: null } }).returns([]);

findManyStub.withArgs({ where: { caseId: 5 } }).returns(folderPath);

findUniqueStub.withArgs({ where: { id: 15 } }).returns(singleFolder);

test.before('sets up database connection mock', () => {
	sinon.stub(databaseConnector, 'folder').get(() => {
		return { findMany: findManyStub, findUnique: findUniqueStub };
	});
});

test('finds all level 1 folders when case has folders attached', async (t) => {
	const folders = await folderRepository.getByCaseId(1, null);

	t.deepEqual(folders, existingLevel1Folders);
});

test('finds all folders in a sub folder', async (t) => {
	const folders = await folderRepository.getByCaseId(2, 14);

	t.deepEqual(folders, existingSubFolders);
});

test('finds no folders when case has no folders attached', async (t) => {
	const folders = await folderRepository.getByCaseId(3, null);

	t.deepEqual(folders, []);
});

test('finds a single folder', async (t) => {
	const folders = await folderRepository.getFolder(15);

	t.deepEqual(folders, singleFolder);
});

test('gets folder path', async (t) => {
	const folders = await folderRepository.getFolderPath(5, 2);

	t.deepEqual(folders, folderPath);
});
