/**
 * Create a sortBy object suitable for use with a database query, from a sortBy query string.
 *
 * @param {string} [queryStr] - in the format `<+|-><field>`
 * @returns {Object<string, string>|undefined}
 */
export function sortByFromQuery(queryStr) {
	let orderBy;

	if (!queryStr) {
		return orderBy;
	}

	let field = queryStr;
	let direction = 'asc';

	switch (queryStr.slice(0, 1)) {
		case '-':
			direction = 'desc';
			field = queryStr.slice(1);
			break;

		case '+':
			direction = 'asc';
			field = queryStr.slice(1);
			break;
	}

	orderBy = {
		[field]: direction
	};

	return orderBy;
}
