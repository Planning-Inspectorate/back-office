// /**
//  *
//  * @param {string} text
//  * @param {string} value
//  * @param {Array<string>|string|undefined}filters
//  * @returns {{checked: boolean | undefined, text: string, value: string}}
//  */
// const buildStatus = (text, value, filters, count = 0) => ({
// 	text: `${text} (${count})`,
// 	value,
// 	checked: filters?.includes(value)
// });

/**
 *
 * @param {string|Array<string>} stringOrArray
 * @returns {Array<string>}
 */
const ensureArray = (stringOrArray) => {
	if (!Array.isArray(stringOrArray) && typeof stringOrArray === 'string') {
		return [stringOrArray];
	}
	return stringOrArray;
};

/**
 * @typedef {any} repFilter
 * @property {string} repFilter.name
 * @property {number} repFilter.count
 *
 */

/**
 *
 * @param {any} filters
 * @param {repFilter[]} repFilters
 * @returns {{checked: boolean | undefined, text: string, value: string}[]}}
 */
export const getFilterViewModel = (filters = [], repFilters = []) => {
	const filtersArray = ensureArray(filters);

	const arr = [
		{ text: 'Awaiting review', value: 'AWAITING_REVIEW' },
		{ text: 'Valid', value: 'VALID' },
		{ text: 'Draft', value: 'DRAFT' },
		{ text: 'Published', value: 'PUBLISHED' },
		{ text: 'Referred', value: 'REFERRED' },
		{ text: 'Withdrawn', value: 'WITHDRAWN' },
		{ text: 'Invalid', value: 'INVALID' },
		{ text: 'Archived', value: 'ARCHIVED' },
		{ text: 'Under 18', value: 'UNDER_18' }
	];

	return arr.map((el) => {
		const count = repFilters.find((rep) => rep.name === el.value)?.count | 0;

		return {
			text: `${el.text} (${count})`,
			value: el.value,
			checked: filtersArray?.includes(el.value)
		};
	});
};

/**
 *
 * @param {any} filters
 * @returns {{under18: boolean, status: *[]}}
 */
export const buildFilterQueryString = (filters) => {
	const filtersArray = ensureArray(filters);

	return {
		status: filtersArray.filter((element) => element !== 'UNDER_18'),
		under18: filtersArray.includes('UNDER_18')
	};
};
