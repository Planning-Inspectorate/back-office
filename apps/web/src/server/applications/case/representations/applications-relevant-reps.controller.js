import { buildQueryString } from '../../common/components/build-query-string.js';
import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import {
	getCase,
	getPublishableRepresentations,
	getRepresentations
} from './applications-relevant-reps.service.js';
import { buildFilterQueryString, getFilterViewModel } from './utils/filter/filter-view-model.js';
import { getPagination } from './utils/pagination.js';
import { hasSearchUpdated } from './utils/search/has-search-updated.js';
import { hasUnpublishedRepUpdates } from './utils/has-unpublished-rep-updates.js';
import { tableSortLinks } from './utils/table.js';
import { isRelevantRepsPeriodClosed } from './utils/is-relevant-reps-period-closed.js';
import { getPublishQueueUrl } from './utils/get-publish-queue-url.js';

const view = 'applications/representations/representations.njk';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function relevantRepsApplications({ params, query }, res) {
	const { caseId } = params;
	const {
		locals: { serviceUrl }
	} = res;
	hasSearchUpdated(query);

	const {
		searchTerm,
		sortBy,
		pageSize = 25,
		page = 1,
		filters = [],
		published: publishedRepsCount
	} = query;

	const caseReference = await getCase(caseId);
	const { keyDates } = caseReference;
	const { preExamination } = keyDates;
	const {
		dateOfRelevantRepresentationClose: repsPeriodCloseDate,
		extensionToDateRelevantRepresentationsClose: repsPeriodCloseDateExtension
	} = preExamination;
	const queryString = buildQueryString({
		searchTerm,
		sortBy,
		pageSize,
		page,
		...buildFilterQueryString(filters)
	});

	const representations = await getRepresentations(caseId, queryString);

	const publishableReps = await getPublishableRepresentations(caseId);

	return res.render(view, {
		representations: getRepresentationsViewModel(representations, caseId),
		caseReference: getCaseReferenceViewModel(caseReference),
		caseId,
		publishQueueURL: getPublishQueueUrl(publishableReps, serviceUrl, caseId),
		resetSuccessBannerURL: `?${queryString}`,
		publishedRepsCount: Number(publishedRepsCount),
		isRelevantRepsPeriodClosed: isRelevantRepsPeriodClosed(
			repsPeriodCloseDate,
			repsPeriodCloseDateExtension
		),
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
