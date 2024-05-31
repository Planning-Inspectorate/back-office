import { buildTableRows } from '../build-table-rows.js';

const items = [
	{ label: 'label-1', text: 'value-1', omitted: true },
	{ label: 'label-2', text: 'value-2' },
	{ label: 'label-3', html: 'value-3', omitted: true },
	{ label: 'label-4', html: 'value-4' }
];

const expectedRows = [
	[{ text: 'label-2' }, { text: 'value-2' }],
	[{ text: 'label-4' }, { html: 'value-4' }]
];

describe('buildTableRow Nunjucks filter', () => {
	it('builds table rows correctly omitting those not required', () => {
		expect(buildTableRows(items)).toEqual(expectedRows);
	});
});
