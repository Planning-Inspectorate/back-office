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
		source: 'TIMETABLE',
		ExaminationTimetableItem: {
			date: '2026-11-30T23:59:00.000Z',
			startDate: null
		}
	},
	{
		id: 21,
		categoryCode: 'REP1a',
		categoryName: 'Deadline 1a',
		source: 'TIMETABLE',
		ExaminationTimetableItem: {
			date: '2026-12-05T23:59:00.000Z',
			startDate: null
		}
	},
	{
		id: 22,
		categoryCode: 'EV1',
		categoryName: 'open floor hearing 1',
		source: 'TIMETABLE',
		ExaminationTimetableItem: {
			date: '2026-12-21T00:00:00.000Z',
			startDate: null
		}
	},
	{
		id: 23,
		categoryCode: 'PDA',
		categoryName: 'Procedural deadline A',
		source: 'TIMETABLE',
		ExaminationTimetableItem: {
			date: '2026-12-06T23:59:00.000Z',
			startDate: null
		}
	},
	{
		id: 16,
		categoryCode: 'OD',
		categoryName: 'Other documents',
		source: 'STATIC'
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

	it('groups timetable derived categories under their respective radio items', () => {
		const result = mapExaminationLibraryCategories(categories, null);

		const events = result.find((category) => category.categoryCode === 'EVX');

		const proceduralDeadlines = result.find((category) => category.categoryCode === 'PDX');

		const deadlines = result.find((category) => category.categoryCode === 'REPX');

		expect(events?.children).toEqual([
			{
				value: 22,
				text: '21 Dec 2026 - open floor hearing 1 (EV1)',
				selected: false
			}
		]);

		expect(proceduralDeadlines?.children).toEqual([
			{
				value: 23,
				text: '6 Dec 2026 - Procedural deadline A (PDA)',
				selected: false
			}
		]);

		expect(deadlines?.children).toEqual([
			{
				value: 20,
				text: '30 Nov 2026 - Deadline 1 (REP1)',
				selected: false
			},
			{
				value: 21,
				text: '5 Dec 2026 - Deadline 1a (REP1a)',
				selected: false
			}
		]);
	});

	it('checks the dynamic category group and selects the saved child', () => {
		const result = mapExaminationLibraryCategories(categories, 22);

		const events = result.find((category) => category.categoryCode === 'EVX');

		expect(events?.checked).toBe(true);
		expect(events?.children).toEqual([
			{
				value: 22,
				text: '21 Dec 2026 - open floor hearing 1 (EV1)',
				selected: true
			}
		]);
	});

	it('selects the correct deadline when multiple deadlines exist', () => {
		const result = mapExaminationLibraryCategories(categories, 21);

		const deadlines = result.find((category) => category.categoryCode === 'REPX');

		expect(deadlines?.checked).toBe(true);
		expect(deadlines?.children?.find((category) => category.value === 20)?.selected).toBe(false);
		expect(deadlines?.children?.find((category) => category.value === 21)?.selected).toBe(true);
	});

	it('only includes dynamic groups that contain categories', () => {
		const categoriesWithoutEvents = categories.filter(
			(category) => category.categoryCode !== 'EV1'
		);

		const result = mapExaminationLibraryCategories(categoriesWithoutEvents, null);

		expect(result.some((category) => category.categoryCode === 'EVX')).toBe(false);
		expect(result.some((category) => category.categoryCode === 'PDX')).toBe(true);
		expect(result.some((category) => category.categoryCode === 'REPX')).toBe(true);
	});

	it('displays dynamic category groups in the correct order', () => {
		const result = mapExaminationLibraryCategories(categories, null);

		const categoryCodes = result.map((category) => category.categoryCode);

		expect(categoryCodes.indexOf('EVX')).toBeLessThan(categoryCodes.indexOf('PDX'));
		expect(categoryCodes.indexOf('PDX')).toBeLessThan(categoryCodes.indexOf('REPX'));
	});

	it('displays other documents after the dynamic category groups', () => {
		const result = mapExaminationLibraryCategories(categories, null);

		expect(result.at(-1)?.categoryCode).toBe('OD');
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
