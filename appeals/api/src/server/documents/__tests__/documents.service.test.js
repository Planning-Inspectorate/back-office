import { defaultCaseFolders } from '../../repositories/folder.layout.repository.js';

describe('appeals documents', () => {
	describe('appeals folders', () => {
		test('all document folders are linked to the correct appeal', async () => {
			const appealId = 2000;
			const foldersForCase = defaultCaseFolders(appealId);
			expect(foldersForCase.length).toBeGreaterThan(0);
			foldersForCase.forEach((f) => expect(f.caseId).toEqual(appealId));
		});
	});
});
