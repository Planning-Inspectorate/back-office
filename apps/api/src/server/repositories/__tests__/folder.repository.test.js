import sinon from 'sinon';
// import { databaseConnector } from '../../utils/database-connector.js';
const { databaseConnector } = await import('../../utils/database-connector.js');

import * as folderRepository from '../folder.repository.js';

const findManyStub = sinon.stub();
const findUniqueStub = sinon.stub();

const existingTopLevelFolders = [
	{
		id: 1,
		displayNameEn: 'test top level folder',
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
		displayNameEn: 'level 1 sub folder',
		displayOrder: 100,
		parentFolderId: 1,
		caseId: 5
	}
];

findManyStub
	.withArgs({ where: { caseId: 1, parentFolderId: null } })
	.returns(existingTopLevelFolders);
findManyStub.withArgs({ where: { caseId: 2, parentFolderId: 14 } }).returns(existingSubFolders);
findManyStub.withArgs({ where: { caseId: 3, parentFolderId: null } }).returns([]);

findManyStub.withArgs({ where: { caseId: 5 } }).returns(folderPath);

findUniqueStub.withArgs({ where: { id: 15 } }).returns(singleFolder);

describe('Folder repository', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'folder').get(() => {
			return { findMany: findManyStub, findUnique: findUniqueStub };
		});
	});

	test('finds all top level folders when case has folders attached', async () => {
		const folders = await folderRepository.getByCaseId(1, null);

		expect(folders).toEqual(existingTopLevelFolders);
	});

	test('finds all folders in a sub folder', async () => {
		const folders = await folderRepository.getByCaseId(2, 14);

		expect(folders).toEqual(existingSubFolders);
	});

	test('finds no folders when case has no folders attached', async () => {
		const folders = await folderRepository.getByCaseId(3, null);

		expect(folders).toEqual([]);
	});

	test('finds a single folder', async () => {
		const folders = await folderRepository.getById(15);

		expect(folders).toEqual(singleFolder);
	});

	test('gets folder path', async () => {
		const folders = await folderRepository.getFolderPath(5, 2);

		expect(folders).toEqual(folderPath);
	});
});
