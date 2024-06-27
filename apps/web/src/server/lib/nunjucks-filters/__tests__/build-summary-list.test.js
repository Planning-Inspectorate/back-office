import { buildSummaryList } from '../build-summary-list.js';

const items = [
	{ label: 'label-1', text: 'value-1', omitted: true },
	{ label: 'label-2', text: 'value-2' },
	{ label: 'label-3', html: 'value-3', omitted: true },
	{ label: 'label-4', html: 'value-4' }
];

const expectedRows = [
	{
		key: { text: 'label-2' },
		value: { text: 'value-2', html: undefined },
		actions: { items: [] }
	},
	{
		key: { text: 'label-4' },
		value: { html: 'value-4', text: undefined },
		actions: { items: [] }
	}
];

describe('buildTableRow Nunjucks filter', () => {
	it('builds table rows correctly omitting those not required', () => {
		expect(buildSummaryList(items)).toEqual(expectedRows);
	});
});
