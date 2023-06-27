const { databaseConnector } = await import('../../utils/database-connector.js');

import * as folderRepository from '../folder.repository.js';

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

describe('Folder repository', () => {
	test('finds all top level folders when case has folders attached', async () => {
		// GIVEN
		databaseConnector.folder.findMany.mockResolvedValue(existingTopLevelFolders);

		// WHEN
		const folders = await folderRepository.getByCaseId(1, null);

		// THEN
		expect(folders).toEqual(existingTopLevelFolders);
	});

	test('finds all folders in a sub folder', async () => {
		// GIVEN
		databaseConnector.folder.findMany.mockResolvedValue(existingSubFolders);

		// WHEN
		const folders = await folderRepository.getByCaseId(2, 14);

		// THEN
		expect(folders).toEqual(existingSubFolders);
	});

	test('finds no folders when case has no folders attached', async () => {
		// GIVEN
		databaseConnector.folder.findMany.mockResolvedValue([]);

		// WHEN
		const folders = await folderRepository.getByCaseId(3, null);

		// THEN
		expect(folders).toEqual([]);
	});

	test('finds a single folder', async () => {
		// GIVEN
		databaseConnector.folder.findUnique.mockResolvedValue(singleFolder);

		// WHEN
		const folders = await folderRepository.getById(15);

		// THEN
		expect(folders).toEqual(singleFolder);
	});

	test('gets folder path', async () => {
		// GIVEN
		databaseConnector.folder.findMany.mockResolvedValue(folderPath);

		// WHEN
		const folders = await folderRepository.getFolderPath(5, 2);

		// THEN
		expect(folders).toEqual(folderPath);
	});

	test('deletes several folders by ids', async () => {
		// GIVEN
		databaseConnector.folder.findMany.mockResolvedValue(folderPath);
		databaseConnector.folder.deleteMany.mockResolvedValue(folderPath);

		// WHEN
		const folders = await folderRepository.deleteFolderMany([2, 1]);

		// THEN
		expect(folders).toEqual(folderPath);
	});

	test('updates a folder name and display order', async () => {
		// GIVEN
		databaseConnector.folder.findUnique.mockResolvedValue(singleFolder);
		const updatedFolderExpected = {
			id: 15,
			displayNameEn: 'test folder name updated',
			displayOrder: 200,
			parentFolderId: null,
			caseId: 4
		};
		databaseConnector.folder.update.mockResolvedValue(updatedFolderExpected);

		// WHEN
		const updatedFolder = await folderRepository.updateFolderById(15, {
			displayNameEn: 'test folder name updated',
			displayOrder: 200
		});

		// THEN
		expect(updatedFolder).toEqual(updatedFolderExpected);
	});
});
