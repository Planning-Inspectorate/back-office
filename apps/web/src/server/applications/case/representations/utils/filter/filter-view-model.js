/**
 * @typedef {any} representationsFilter
 * @property {string} repFilter.name
 * @property {number} repFilter.count
 *
 */

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
 *
 * @param {representationsFilter[]} representationsFilters
 * @param {string} value
 * @return {number}
 */
const findCounterOrZero = (representationsFilters, value) =>
	representationsFilters.find((rep) => rep.name === value)?.count | 0;

/**
 *
 * @param {any} filters
 * @param {string} value
 * @return {boolean}
 */
const filterValueIsChecked = (filters = [], value) => ensureArray(filters).includes(value);
/**
 *
 * @param {any} filters
 * @param {representationsFilter[]} representationsFilters
 * @returns {{checked: boolean | undefined, text: string, value: string}[]}}
 */
export const getFilterViewModel = (filters = [], representationsFilters = []) =>
	[
		{ text: 'Awaiting review', value: 'AWAITING_REVIEW' },
		{ text: 'Valid', value: 'VALID' },
		{ text: 'Draft', value: 'DRAFT' },
		{ text: 'Published', value: 'PUBLISHED' },
		{ text: 'Referred', value: 'REFERRED' },
		{ text: 'Withdrawn', value: 'WITHDRAWN' },
		{ text: 'Invalid', value: 'INVALID' },
		{ text: 'Archived', value: 'ARCHIVED' },
		{ text: 'Under 18', value: 'UNDER_18' }
	].map((el) => ({
		text: `${el.text} (${findCounterOrZero(representationsFilters, el.value)})`,
		value: el.value,
		checked: filterValueIsChecked(filters, el.value)
	}));

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
