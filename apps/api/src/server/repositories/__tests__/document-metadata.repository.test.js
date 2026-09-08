import { jest } from '@jest/globals';
import { getCurrentPublishedVersion } from '../document-metadata.repository.js';
const { databaseConnector } = await import('#utils/database-connector.js');

describe('Document Metadata Repository', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getCurrentPublishedVersion', () => {
		it('returns only the current/latest published version, excluding stale superseded versions', async () => {
			// document has 2 versions; version 1 is a stale superseded version still marked
			// 'published' (e.g. migrated from Horizon, never had a real blob copy), version 2
			// is the current published version with a real blob
			databaseConnector.document.findUnique.mockResolvedValue({ latestVersionId: 2 });

			const currentVersion = {
				documentGuid: 'doc-1',
				version: 2,
				publishedStatus: 'published',
				publishedBlobContainer: 'published-documents',
				publishedBlobPath: 'some-file.pdf'
			};
			databaseConnector.documentVersion.findFirst.mockResolvedValue(currentVersion);

			const result = await getCurrentPublishedVersion('doc-1');

			expect(databaseConnector.document.findUnique).toHaveBeenCalledWith({
				where: { guid: 'doc-1' },
				select: { latestVersionId: true }
			});
			expect(databaseConnector.documentVersion.findFirst).toHaveBeenCalledWith({
				where: {
					documentGuid: 'doc-1',
					version: 2,
					publishedStatus: 'published',
					isDeleted: false
				}
			});
			expect(result).toEqual(currentVersion);
		});

		it('returns null if the document has no latestVersionId', async () => {
			databaseConnector.document.findUnique.mockResolvedValue({ latestVersionId: null });

			const result = await getCurrentPublishedVersion('doc-1');

			expect(databaseConnector.documentVersion.findFirst).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('returns null if the document does not exist', async () => {
			databaseConnector.document.findUnique.mockResolvedValue(null);

			const result = await getCurrentPublishedVersion('doc-1');

			expect(databaseConnector.documentVersion.findFirst).not.toHaveBeenCalled();
			expect(result).toBeNull();
		});

		it('returns null if the latest version is not published', async () => {
			databaseConnector.document.findUnique.mockResolvedValue({ latestVersionId: 2 });
			databaseConnector.documentVersion.findFirst.mockResolvedValue(null);

			const result = await getCurrentPublishedVersion('doc-1');

			expect(result).toBeNull();
		});
	});
});
