import {
	RELEVANT_REPRESENTATION_STATUS_MAP,
	RELEVANT_REPRESENTATION_STATUS_LIST
} from '../map-relevant-representation-status.js';

describe('RELEVANT_REPRESENTATION_STATUS_MAP', () => {
	it('should contain all expected status keys and values', () => {
		expect(RELEVANT_REPRESENTATION_STATUS_MAP).toEqual({
			AWAITING_REVIEW: 'AWAITING_REVIEW',
			VALID: 'VALID',
			DRAFT: 'DRAFT',
			PUBLISHED: 'PUBLISHED',
			REFERRED: 'REFERRED',
			WITHDRAWN: 'WITHDRAWN',
			INVALID: 'INVALID',
			ARCHIVED: 'ARCHIVED',
			UNDER_18: 'UNDER_18',
			UNPUBLISHED: 'UNPUBLISHED'
		});
	});

	it('should have matching keys and values', () => {
		Object.entries(RELEVANT_REPRESENTATION_STATUS_MAP).forEach(([key, value]) => {
			expect(key).toBe(value);
		});
	});
});

describe('RELEVANT_REPRESENTATION_STATUS_LIST', () => {
	it('should be an array of all status values', () => {
		expect(Array.isArray(RELEVANT_REPRESENTATION_STATUS_LIST)).toBe(true);
		expect(RELEVANT_REPRESENTATION_STATUS_LIST).toEqual(
			Object.values(RELEVANT_REPRESENTATION_STATUS_MAP)
		);
	});

	it('should contain all unique status values', () => {
		const unique = new Set(RELEVANT_REPRESENTATION_STATUS_LIST);
		expect(unique.size).toBe(RELEVANT_REPRESENTATION_STATUS_LIST.length);
	});
});
