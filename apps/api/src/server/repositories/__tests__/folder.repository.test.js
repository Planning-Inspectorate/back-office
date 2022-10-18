import test from 'ava';
import sinon from 'sinon';
import { databaseConnector } from '../../utils/database-connector.js';
import * as folderRepository from '../folder.repository.js';

const findManyStub = sinon.stub();

const existingFolders = [
	{ id: 1, displayNameEn: 'test folder', displayOrder: 100, parentFolderId: null, caseId: 1 }
];

findManyStub.withArgs({ where: { caseId: 1 } }).returns(existingFolders);
findManyStub.withArgs({ where: { caseId: 2 } }).returns([]);

test.before('sets up database connection mock', () => {
	sinon.stub(databaseConnector, 'folder').get(() => {
		return { findMany: findManyStub };
	});
});

test('finds all folders when case has folders attached', async (t) => {
	const folders = await folderRepository.getByCaseId(1);

	t.deepEqual(folders, existingFolders);
});

test('finds no folders when case has no folders attached', async (t) => {
	const folders = await folderRepository.getByCaseId(2);

	t.deepEqual(folders, []);
});
