import { decreaseDocumentCount, increaseDocumentCount, setPath } from '../folder.repository.js';

const { databaseConnector } = await import('../../utils/database-connector.js');

import * as folderRepository from '../folder.repository.js';
import BackOfficeAppError from '#utils/app-error.js';
import { jest } from '@jest/globals';

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

describe('setPath', () => {
	it('sets the path as the /ID when no parent folder', async () => {
		//Arrange
		const id = 42;
		const expectedResult = { id, path: '/42/' };
		databaseConnector.folder.update.mockResolvedValue(expectedResult);

		//Act
		const path = await setPath(id);

		//Assert
		expect(databaseConnector.folder.update).toHaveBeenCalledWith({
			where: { id },
			data: { path: '/42' }
		});
		expect(path).toEqual(expectedResult);
	});
	it('sets the path as the "/parentId/ID" when no parent folder', async () => {
		//Arrange
		const id = 2;
		const folder = { id, parentFolderId: 1, path: null };
		const expectedResult = { ...folder, path: '/1/2' };
		databaseConnector.folder.findUnique.mockResolvedValue(folder);
		databaseConnector.folder.update.mockResolvedValue(expectedResult);

		//Act
		const path = await setPath(id);

		//Assert
		expect(path).toEqual(expectedResult);
	});
});

describe('decreaseDocumentCount', () => {
	it('decreases document count for folder and ancestors', async () => {
		//Arrange
		const folder = { id: 1, path: '/1', documentCount: 1 };
		const expectedResult = { ...folder, documentCount: 0 };
		databaseConnector.folder.findUnique.mockResolvedValue(folder);
		databaseConnector.$executeRaw = jest.fn().mockResolvedValue(expectedResult);

		//Act
		const result = await decreaseDocumentCount(1);

		//Assert
		expect(result).toEqual(expectedResult);
	});

	it('throws error if folder or path is missing', async () => {
		//Arrange
		databaseConnector.folder.findUnique.mockResolvedValue(null);
		//Act and assert
		await expect(decreaseDocumentCount(1)).rejects.toThrow(BackOfficeAppError);
	});

	it('throws error if $executeRaw fails', async () => {
		//Arrange
		const folder = { id: 1, path: '/1' };
		databaseConnector.folder.findUnique.mockResolvedValue(folder);
		databaseConnector.$executeRaw.mockImplementation(() => {
			throw new Error('DB error');
		});
		//Act and assert
		await expect(decreaseDocumentCount(1)).rejects.toThrow(BackOfficeAppError);
	});
});

describe('increaseDocumentCount', () => {
	it('increases document count for folder', async () => {
		//Arrange
		const folder = { id: 2, path: '/1/2', documentCount: 0 };
		const expectedResult = { ...folder, documentCount: 1 };
		databaseConnector.folder.findUnique.mockResolvedValue(folder);
		databaseConnector.$executeRaw = jest.fn().mockResolvedValue(expectedResult);

		//Act
		const result = await increaseDocumentCount(1);

		//Assert
		expect(result).toEqual(expectedResult);
	});

	it('throws error if folder or path is missing', async () => {
		// Arrange
		databaseConnector.folder.findUnique.mockResolvedValue(null);
		//Act and Assert
		await expect(increaseDocumentCount(1)).rejects.toThrow(BackOfficeAppError);
	});

	it('throws error if $executeRaw fails', async () => {
		//Arrange
		const folder = { id: 1, path: '/1' };
		databaseConnector.folder.findUnique.mockResolvedValue(folder);
		databaseConnector.$executeRaw.mockImplementation(() => {
			throw new Error('DB error');
		});

		//Act and assert
		await expect(increaseDocumentCount(1)).rejects.toThrow(BackOfficeAppError);
	});
});
