/**
 * Get the count of published representations from the filters array
 * @param {Array<{ name: string; count: number; }>} filters - Array of filter objects from representations response
 * @returns {number} - Count of published representations
 */
export function getPublishedRepresentationsCount(filters) {
	let allPublishedReps = 0;

	if (Array.isArray(filters)) {
		allPublishedReps =
			filters.find(
				(/** @type {{ name: string; count: number; }} */ publishedFilter) =>
					publishedFilter.name === 'PUBLISHED'
			)?.count || 0;
	}

	return allPublishedReps;
}
