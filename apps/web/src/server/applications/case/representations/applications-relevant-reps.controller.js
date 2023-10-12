import { buildQueryString } from '../../common/components/build-query-string.js';
import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import {
	getCase,
	getPublishableReps,
	getRepresentations
} from './applications-relevant-reps.service.js';
import { buildFilterQueryString, getFilterViewModel } from './utils/filter/filter-view-model.js';
import { getPagination } from './utils/pagination.js';
import { publishQueueUrl } from './config.js';
import { hasSearchUpdated } from './utils/search/has-search-updated.js';
import { hasUnpublishedRepUpdates } from './utils/has-unpublished-rep-updates.js';
import { tableSortLinks } from './utils/table.js';
import { isRelevantRepsPeriodClosed } from './utils/is-relevant-reps-period-closed.js';

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
	const { keyDates } = caseReference;
	const { preExamination } = keyDates;
	const { dateOfRelevantRepresentationClose, extensionToDateRelevantRepresentationsClose } =
		preExamination;

	const representations = await getRepresentations(
		caseId,
		buildQueryString({ searchTerm, sortBy, pageSize, page, ...buildFilterQueryString(filters) })
	);
	const publishQueueURL = isRelevantRepsPeriodClosed(
		dateOfRelevantRepresentationClose,
		extensionToDateRelevantRepresentationsClose
	)
		? publishQueueUrl
		: '';
	const publishableReps = await getPublishableReps(caseId);

	return res.render(view, {
		representations: getRepresentationsViewModel(representations, caseId),
		caseReference: getCaseReferenceViewModel(caseReference),
		caseId,
		publishQueueURL,
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
		filters: getFilterViewModel(filters, representations.filters),
		showUnpublishedRepUpdatesBanner: hasUnpublishedRepUpdates(publishableReps)
	});
}
