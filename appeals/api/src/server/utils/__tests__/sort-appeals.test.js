import { sortAppeals } from '#utils/appeal-sorter.js';

describe('Sort appeals', () => {
	test('match results', () => {
		const appeals = [
			{ appealId: 1, createdAt: '2024-01-01', dueDate: new Date('2024-02-01') },
			{ appealId: 2, createdAt: '2024-01-03', dueDate: new Date('2023-12-31') },
			{ appealId: 3, createdAt: '2024-01-02', dueDate: new Date('2024-01-31') }
		];

		//@ts-ignore
		const data = sortAppeals(appeals);
		const result = data.map((a) => a?.appealId);

		expect(result).toEqual([2, 3, 1]);
	});

	test('handles undefined dueDate', () => {
		const appeals = [
			{ appealId: 1, createdAt: '2024-01-01', dueDate: undefined },
			{ appealId: 2, createdAt: '2024-01-03', dueDate: new Date('2023-12-31') },
			{ appealId: 3, createdAt: '2024-01-02', dueDate: undefined }
		];

		//@ts-ignore
		const data = sortAppeals(appeals);
		const result = data.map((a) => a?.appealId);

		expect(result).toEqual([2, 1, 3]);
	});
});
