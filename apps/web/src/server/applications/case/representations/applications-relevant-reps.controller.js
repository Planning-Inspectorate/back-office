import { buildQueryString } from '../../common/components/build-query-string.js';
import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import { getCase, getRepresentations } from './applications-relevant-reps.service.js';
import { buildFilterQueryString, getFilterViewModel } from './utils/filter/filter-view-model.js';
import { getPagination } from './utils/pagination.js';
import { hasSearchUpdated } from './utils/search/has-search-updated.js';
import { tableSortLinks } from './utils/table.js';

const view = 'applications/representations/representations.njk';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function relevantRepsApplications({ params, query }, res) {
	const { caseId } = params;

	hasSearchUpdated(query);

	const { searchTerm, sortBy, pageSize = 25, page = 1, filters = [] } = query;

	const caseReference = await getCase(caseId);
	const representations = await getRepresentations(
		caseId,
		buildQueryString({ searchTerm, sortBy, pageSize, page, ...buildFilterQueryString(filters) })
	);

	return res.render(view, {
		representations: getRepresentationsViewModel(representations, caseId),
		caseReference: getCaseReferenceViewModel(caseReference),
		caseId,
		table: {
			sortLinks: tableSortLinks(query)
		},
		pagination: getPagination(query, representations),
		queryData: {
			searchTerm,
			sortBy,
			pageSize,
			page
		},
		filters: getFilterViewModel(filters, representations.filters)
	});
}
