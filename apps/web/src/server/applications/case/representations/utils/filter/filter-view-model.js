/**
 *
 * @param {string} text
 * @param {string} value
 * @param {Array<string>|string|undefined}filters
 * @returns {{checked: boolean | undefined, text: string, value: string}}
 */
const buildStatus = (text, value, filters) => ({ text, value, checked: filters?.includes(value) });

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
 * @param {any} filters
 * @returns {{checked: boolean | undefined, text: string, value: string}[]}}
 */
export const getFilterViewModel = (filters) => {
	const filtersArray = ensureArray(filters);

	return [
		buildStatus('Awaiting review', 'AWAITING_REVIEW', filtersArray),
		buildStatus('Valid', 'VALID', filtersArray),
		buildStatus('Draft', 'DRAFT', filtersArray),
		buildStatus('Published', 'PUBLISHED', filtersArray),
		buildStatus('Referred', 'REFERRED', filtersArray),
		buildStatus('Withdrawn', 'WITHDRAWN', filtersArray),
		buildStatus('Invalid', 'INVALID', filtersArray),
		buildStatus('Archived', 'ARCHIVED', filtersArray),
		buildStatus('Under 18', 'UNDER_18', filtersArray)
	];
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
