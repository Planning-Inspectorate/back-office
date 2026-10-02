import { mapExaminationLibraryCategories } from '../documentation-metadata.view-model.js';

/** @type {import('../documentation-metadata.view-model.js').ExaminationLibraryCategoryForView[]} */
const categories = [
	{
		id: 3,
		categoryCode: 'APP',
		categoryName: 'Application form',
		source: 'STATIC'
	},
	{
		id: 4,
		categoryCode: 'APP',
		categoryName: 'Plans',
		source: 'STATIC'
	},
	{
		id: 7,
		categoryCode: 'APP',
		categoryName: 'Reports',
		source: 'STATIC'
	},
	{
		id: 10,
		categoryCode: 'AoC',
		categoryName: 'Adequacy of consultation responses',
		source: 'STATIC'
	},
	{
		id: 12,
		categoryCode: 'AS',
		categoryName: 'Additional submissions',
		source: 'STATIC'
	},
	{
		id: 14,
		categoryCode: 'RR',
		categoryName: 'Relevant representations',
		source: 'STATIC'
	},
	{
		id: 15,
		categoryCode: 'NELC',
		categoryName: 'No examination library category',
		source: 'STATIC'
	},
	{
		id: 20,
		categoryCode: 'REP1',
		categoryName: 'Deadline 1',
		source: 'TIMETABLE'
	}
];

describe('mapExaminationLibraryCategories', () => {
	it('groups APP categories under a single radio item', () => {
		const result = mapExaminationLibraryCategories(categories, null);

		const app = result.find((category) => category.categoryCode === 'APP');

		expect(app).toEqual({
			value: 'APP',
			text: 'Application documents (APP)',
			categoryCode: 'APP',
			checked: false,
			children: [
				{
					value: 3,
					text: 'Application form',
					selected: false
				},
				{
					value: 4,
					text: 'Plans',
					selected: false
				},
				{
					value: 7,
					text: 'Reports',
					selected: false
				}
			]
		});
	});

	it('marks a standard category as checked when it is already selected', () => {
		const result = mapExaminationLibraryCategories(categories, 10);

		const aoc = result.find((category) => category.categoryCode === 'AoC');

		expect(aoc?.checked).toBe(true);
	});

	it('checks APP and selects the saved APP child', () => {
		const result = mapExaminationLibraryCategories(categories, 7);

		const app = result.find((category) => category.categoryCode === 'APP');

		expect(app?.checked).toBe(true);

		expect(app?.children?.find((category) => category.value === 7)).toEqual({
			value: 7,
			text: 'Reports',
			selected: true
		});
	});

	it('does not include relevant representations', () => {
		const result = mapExaminationLibraryCategories(categories, null);

		expect(result.some((category) => category.categoryCode === 'RR')).toBe(false);
	});

	it('does not include timetable derived categories', () => {
		const result = mapExaminationLibraryCategories(categories, null);

		expect(result.some((category) => category.categoryCode === 'REP1')).toBe(false);
	});

	it('displays NELC without the category code', () => {
		const result = mapExaminationLibraryCategories(categories, 15);

		const noCategory = result.find((category) => category.categoryCode === 'NELC');

		expect(noCategory).toEqual({
			value: 15,
			text: 'No examination library category',
			categoryCode: 'NELC',
			checked: true
		});
	});
});
