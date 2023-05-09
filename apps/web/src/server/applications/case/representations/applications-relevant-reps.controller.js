import * as express from 'express';
import { buildQueryString } from '../../common/components/build-query-string.js';
import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import { getCase, getRepresentations } from './applications-relevant-reps.service.js';
import { getPagination } from './utils/pagination.js';
import { hasSearchUpdated } from './utils/search/has-search-updated.js';
import { tableSortLinks } from './utils/table.js';

const view = 'applications/representations/representations.njk';

/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function relevantRepsApplications({ params, query }, res) {
	const { caseId } = params;

	hasSearchUpdated(query);

	const { searchTerm, sortBy, pageSize = 25, page = 1 } = query;
	const caseReference = await getCase(caseId);
	const representations = await getRepresentations(
		caseId,
		buildQueryString({ searchTerm, sortBy, pageSize, page })
	);

	return res.render(view, {
		representations: getRepresentationsViewModel(representations),
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
		}
	});
}
