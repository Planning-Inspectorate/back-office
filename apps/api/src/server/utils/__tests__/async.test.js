import { filterAsync } from '../async.js';

describe('filterAsync', () => {
	it('should return the full input list if the predicate returns true for all', async () => {
		const list = [1, 2, 3];
		const pred = async () => true;

		const result = await filterAsync(pred, list);
		expect(result).toEqual(list);
	});

	it('items for which the predicate returns false should be excluded from the result', async () => {
		const list = [1, 2, 3];

		/** @type {(x: number) => Promise<boolean>} */
		const isOdd = async (x) => x % 2 !== 0;

		const result = await filterAsync(isOdd, list);
		expect(result).toEqual([1, 3]);
	});

	it('should return items in the order they appear in the input list', async () => {
		const list = [1, 5, 3, 7, 2];
		const expected = [1, 3, 7];

		/** @type {(x: number) => Promise<boolean>} */
		const pred = async (x) => expected.includes(x);

		const result = await filterAsync(pred, list);
		expect(result).toEqual([1, 3, 7]);
	});
});
