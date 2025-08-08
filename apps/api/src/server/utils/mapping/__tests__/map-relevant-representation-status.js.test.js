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

	it('should have a list of all status values', () => {
		expect(RELEVANT_REPRESENTATION_STATUS_LIST).toEqual([
			'AWAITING_REVIEW',
			'VALID',
			'DRAFT',
			'PUBLISHED',
			'REFERRED',
			'WITHDRAWN',
			'INVALID',
			'ARCHIVED',
			'UNDER_18',
			'UNPUBLISHED'
		]);
	});

	it('should not contain duplicate values in the list', () => {
		const unique = new Set(RELEVANT_REPRESENTATION_STATUS_LIST);
		expect(unique.size).toBe(RELEVANT_REPRESENTATION_STATUS_LIST.length);
	});
});
