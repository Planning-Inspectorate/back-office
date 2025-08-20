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

	it('should have only string values', () => {
		Object.values(RELEVANT_REPRESENTATION_STATUS_MAP).forEach((value) => {
			expect(typeof value).toBe('string');
		});
	});
});

describe('RELEVANT_REPRESENTATION_STATUS_LIST', () => {
	it('should be an array of all status values from the map', () => {
		expect(RELEVANT_REPRESENTATION_STATUS_LIST).toEqual(
			Object.values(RELEVANT_REPRESENTATION_STATUS_MAP)
		);
	});

	it('should contain all expected status values', () => {
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

	it('should have only string values', () => {
		RELEVANT_REPRESENTATION_STATUS_LIST.forEach((value) => {
			expect(typeof value).toBe('string');
		});
	});
});
