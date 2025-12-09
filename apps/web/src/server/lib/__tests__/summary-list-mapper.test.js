import { buildSummaryListRows } from '../summary-list-mapper';

describe('buildSummaryList', () => {
	it('maps items with value only', () => {
		const items = [{ key: 'Name', value: 'John Doe' }];
		const result = buildSummaryListRows(items);
		expect(result).toEqual([{ key: { text: 'Name' }, value: { text: 'John Doe' } }]);
	});

	it('maps items with html', () => {
		const items = [{ key: 'Description', html: '<b>Bold</b>' }];
		const result = buildSummaryListRows(items);
		expect(result).toEqual([{ key: { text: 'Description' }, value: { html: '<b>Bold</b>' } }]);
	});

	it('maps items with actions', () => {
		const items = [
			{
				key: 'Edit',
				value: 'Edit value',
				actions: [{ href: '/edit', text: 'Edit', visuallyHiddenText: 'hidden' }]
			}
		];
		const result = buildSummaryListRows(items);
		expect(result).toEqual([
			{
				key: { text: 'Edit' },
				value: { text: 'Edit value' },
				actions: {
					items: [{ href: '/edit', text: 'Edit', visuallyHiddenText: 'hidden' }]
				}
			}
		]);
	});

	it('handles empty actions array', () => {
		const items = [
			{
				key: 'No Actions',
				value: 'Nothing',
				actions: []
			}
		];
		const result = buildSummaryListRows(items);
		expect(result).toEqual([{ key: { text: 'No Actions' }, value: { text: 'Nothing' } }]);
	});

	it('handles missing value and html', () => {
		const items = [{ key: 'Empty' }];
		const result = buildSummaryListRows(items);
		expect(result).toEqual([{ key: { text: 'Empty' }, value: { text: undefined } }]);
	});
});
