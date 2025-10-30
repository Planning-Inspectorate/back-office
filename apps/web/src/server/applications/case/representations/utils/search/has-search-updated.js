/**
 *
 * @param {object} query
 * @param {string=} query.searchUpdated
 * @param {number=} query.page
 */
export const hasSearchUpdated = (query) => {
	const changed = Boolean(query.searchUpdated);
	if (changed) {
		query.page = 1;
		delete query.searchUpdated;
	}
	return changed;
};
