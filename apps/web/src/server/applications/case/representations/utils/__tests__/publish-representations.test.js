import { getPublishedRepIdsAndCount } from '../publish-representations.js';

describe('getPublishedRepIdsAndCount', () => {
	it('returns empty arrays/count for non-array input', () => {
		const result = getPublishedRepIdsAndCount(null);
		expect(result).toEqual({ publishedRepIds: [], publishedRepsCount: 0 });
	});

	it('returns correct ids and count for published representations', () => {
		const items = [
			{ id: '1', status: 'PUBLISHED' },
			{ id: '2', status: 'DRAFT' },
			{ id: '3', status: 'PUBLISHED' }
		];
		const result = getPublishedRepIdsAndCount(items);
		expect(result.publishedRepIds).toEqual([1, 3]);
		expect(result.publishedRepsCount).toBe(2);
	});

	it('returns count 0 if no published representations', () => {
		const items = [
			{ id: '1', status: 'DRAFT' },
			{ id: '2', status: 'SUBMITTED' }
		];
		const result = getPublishedRepIdsAndCount(items);
		expect(result.publishedRepIds).toEqual([]);
		expect(result.publishedRepsCount).toBe(0);
	});

	it('handles string ids and converts to numbers', () => {
		const items = [{ id: '10', status: 'PUBLISHED' }];
		const result = getPublishedRepIdsAndCount(items);
		expect(result.publishedRepIds).toEqual([10]);
	});
});
