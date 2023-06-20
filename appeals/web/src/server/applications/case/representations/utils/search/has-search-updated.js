/**
 *
 * @param {object} query
 * @param {string=} query.searchUpdated
 * @param {number=} query.page
 */
export const hasSearchUpdated = (query) => {
	if (query.searchUpdated) {
		query.page = 1;
		delete query.searchUpdated;
	}
};
