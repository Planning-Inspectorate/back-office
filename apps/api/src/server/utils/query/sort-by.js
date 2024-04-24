/**
 * Create a sortBy object suitable for use with a database query, from a sortBy query string.
 *
 * @param {string|any} [queryStr] - in the format `<+|-><field>`
 * @returns {Object<string, string>[]|undefined}
 */
export function sortByFromQuery(queryStr) {
	if (typeof queryStr !== 'string' || queryStr.trim() === '') {
		return undefined;
	}

	const orderBy = [];
	let direction = 'asc';
	let fieldName = '';

	for (let i = 0; i < queryStr.length; i++) {
		const currentChar = queryStr[i];

		if (currentChar === '+' || currentChar === '-') {
			direction = currentChar === '+' ? 'asc' : 'desc';
			fieldName = '';
		} else {
			fieldName += currentChar;

			const isLastChar = i === queryStr.length - 1;
			const isNextCharOperator = queryStr[i + 1] === '+' || queryStr[i + 1] === '-';

			if (isLastChar || isNextCharOperator) {
				orderBy.push({ [fieldName]: direction });
			}
		}
	}

	return orderBy.length > 0 ? orderBy : undefined;
}
