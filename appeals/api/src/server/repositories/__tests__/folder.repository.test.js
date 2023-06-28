const { databaseConnector } = await import('../../utils/database-connector.js');

import * as folderRepository from '../folder.repository.js';
import { defaultCaseFolders } from '../folder.layout.repository.js';

describe('Folder repository', () => {
	test('finds all top level folders when case has folders attached', async () => {
		// GIVEN
		databaseConnector.folder.findMany.mockResolvedValue(defaultCaseFolders(10));

		// WHEN
		const folders = await folderRepository.getByCaseId(10);

		// THEN
		expect(folders).toEqual(defaultCaseFolders(10));
	});
});
