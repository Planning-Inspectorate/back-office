import { findPreviousVersion } from '#utils/find-previous-version.js';

describe('Find previousVersion', () => {
	test('match results', () => {
		expect(findPreviousVersion([1, 4, 5, 6, 8, 23, 2, 56], 8)).toEqual(6);
		expect(findPreviousVersion([1, 4, 5, 6, 8, 23, 2, 56], 56)).toEqual(23);
		expect(findPreviousVersion([1, 4, 5, 6, 8, 23, 2, 56], 4)).toEqual(2);
		expect(findPreviousVersion([1, 4, 5, 6, 8, 23, 2, 56], 2)).toEqual(1);
		expect(findPreviousVersion([1, 4, 5, 6, 8, 23, 2, 56], 8)).toEqual(6);
		expect(findPreviousVersion([1, 4, 5, 6, 8, 23, 2, 56], 23)).toEqual(8);
	});
});
