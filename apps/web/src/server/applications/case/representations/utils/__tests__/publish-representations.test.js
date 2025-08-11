import {
	getPublishRepresentationsPayload,
	getNumberOfRepresentationsPublished,
	getPublishedRepIdsAndCount,
	getPublishedRepresentationsRedirectURL
} from '../publish-representations.js';

describe('publish-representations utils', () => {
	describe('getPublishRepresentationsPayload', () => {
		it('returns payload with representationIds and actionBy', () => {
			const session = { user: { name: 'Test User' } };
			const ids = [1, 2, 3];
			const result = getPublishRepresentationsPayload(session, ids);
			expect(result).toEqual({
				json: {
					representationIds: ids,
					actionBy: undefined // getAccount returns undefined in test
				}
			});
		});
	});

	describe('getNumberOfRepresentationsPublished', () => {
		it('returns the count of publishedRepIds', () => {
			const count = getNumberOfRepresentationsPublished({ publishedRepIds: [1, 2, 3] });
			expect(count).toBe(3);
		});
		it('throws if no representations', () => {
			expect(() => getNumberOfRepresentationsPublished({ publishedRepIds: [] })).toThrow();
		});
	});

	describe('getPublishedRepIdsAndCount', () => {
		it('returns empty if items is not array', () => {
			const result = getPublishedRepIdsAndCount(null);
			expect(result).toEqual({ publishedRepIds: [], publishedRepsCount: 0 });
		});
		it('returns only published IDs and count', () => {
			const items = [
				{ id: 1, status: 'PUBLISHED' },
				{ id: 2, status: 'VALID' },
				{ id: 3, status: 'PUBLISHED' }
			];
			const result = getPublishedRepIdsAndCount(items);
			expect(result.publishedRepIds).toEqual([1, 3]);
			expect(result.publishedRepsCount).toBe(2);
		});
	});

	describe('getPublishedRepresentationsRedirectURL', () => {
		it('returns correct redirect URL', () => {
			const url = getPublishedRepresentationsRedirectURL('service', '123', 5);
			expect(url).toBe('service/case/123/relevant-representations?published=5');
		});
	});
});
