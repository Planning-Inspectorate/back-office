import { buildTable } from '../table-mapper';

describe('buildTable', () => {
	it('maps rows with text only', () => {
		const params = {
			headers: ['Name', 'Age'],
			rows: [
				[{ text: 'John' }, { text: '30' }],
				[{ text: 'Jane' }, { text: '25' }]
			]
		};
		const result = buildTable(params);
		expect(result).toEqual({
			firstCellIsHeader: false,
			rows: [
				[{ text: 'John' }, { text: '30' }],
				[{ text: 'Jane' }, { text: '25' }]
			],
			head: [{ text: 'Name' }, { text: 'Age' }]
		});
	});

	it('maps rows with html cells', () => {
		const params = {
			headers: ['Description'],
			rows: [[{ html: '<b>Bold</b>' }]]
		};
		const result = buildTable(params);
		expect(result).toEqual({
			firstCellIsHeader: false,
			rows: [[{ html: '<b>Bold</b>' }]],
			head: [{ text: 'Description' }]
		});
	});

	it('sets caption if provided', () => {
		const params = {
			headers: ['A'],
			rows: [[{ text: 'B' }]],
			caption: 'Test Caption'
		};
		const result = buildTable(params);
		expect(result.caption).toBe('Test Caption');
	});

	it('sets firstCellIsHeader if true', () => {
		const params = {
			headers: ['A'],
			rows: [[{ text: 'B' }]],
			firstCellIsHeader: true
		};
		const result = buildTable(params);
		expect(result.firstCellIsHeader).toBe(true);
	});

	it('handles empty headers and caption', () => {
		const params = {
			rows: [[{ text: 'Only' }]]
		};
		const result = buildTable(params);
		expect(result).toEqual({
			firstCellIsHeader: false,
			rows: [[{ text: 'Only' }]]
		});
	});
});
