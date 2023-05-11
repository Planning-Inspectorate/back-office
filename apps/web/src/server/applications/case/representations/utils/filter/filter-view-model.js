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
 * @param {any} filters
 * @returns {{checked: boolean | undefined, text: string, value: string}[]}}
 */
export const getFilterViewModel = (filters) => [
	buildStatus('Awaiting review', 'AWAITING_REVIEW', filters),
	buildStatus('Referred', 'REFERRED', filters),
	buildStatus('Invalid', 'INVALID', filters),
	buildStatus('Valid', 'VALID', filters),
	buildStatus('Published', 'PUBLISHED', filters),
	buildStatus('Withdrawn', 'WITHDRAWN', filters),
	buildStatus('Archived', 'ARCHIVED', filters),
	buildStatus('Under 18', 'UNDER_18', filters)
];

/**
 *
 * @param {any} filters
 * @returns {{under18: boolean, status: *[]}}
 */
export const buildFilterQueryString = (filters) => {
	const array = Array.isArray(filters) ? filters : [filters];

	return {
		status: array.filter((element) => element !== 'UNDER_18'),
		under18: array.includes('UNDER_18')
	};
};
