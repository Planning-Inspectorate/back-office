import { buildQueryString } from '../../common/components/build-query-string.js';
import {
	getCaseReferenceViewModel,
	getRepresentationsViewModel
} from './application-representations.view-model.js';
import {
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
import { getKeyDates } from './utils/get-key-dates.js';
import { getPublishedRepresentationsCount } from './utils/get-published-representations-count.js';
import documentationSessionHandlers from '../documentation/applications-documentation.session.js';
import { url } from '../../../lib/nunjucks-filters/index.js';

const view = 'applications/representations/representations.njk';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function relevantRepsApplications({ query, session }, res) {
	const { caseId } = res.locals;
	const {
		locals: { serviceUrl }
	} = res;

	const searchChanged = hasSearchUpdated(query);

	documentationSessionHandlers.setSessionFolderPage(
		session,
		url('representations', {
			caseId
		})
	);

	const {
		searchTerm,
		sortBy,
		pageSize = 25,
		page = 1,
		filters = [],
		published: publishedRepsCount,
		unpublished: unpublishedRepsCount
	} = query;

	/*
	 * When filters applied or new search performed
	 * reset pagination to page 1 by redirecting with updated query params
	 * Redirect query is built from the original 'filters' from the request
	 * so that the UI checkboxes remain checked after reload
	 */
	if (searchChanged) {
		const redirectQueries = buildQueryString({
			searchTerm,
			sortBy,
			pageSize,
			page,
			filters
		});
		return res.redirect(`?${redirectQueries}`);
	}

	const caseData = res.locals.case;
	const { keyDates } = caseData;
	const { preExamination } = keyDates;
	const {
		dateOfRelevantRepresentationClose: repsPeriodCloseDate,
		extensionToDateRelevantRepresentationsClose: repsPeriodCloseDateExtension,
		dateRRepAppearOnWebsite: publishedDate
	} = preExamination;

	/*
	 * Build the query string for the API request to get filtered reps
	 * This includes the filter parameters the API expects*/
	const queryString = buildQueryString({
		searchTerm,
		sortBy,
		pageSize,
		page,
		...buildFilterQueryString(filters)
	});

	const representations = await getRepresentations(caseId, queryString);
	const publishableReps = await getPublishableRepresentations(caseId);

	const allPublishedReps = getPublishedRepresentationsCount(representations.filters);

	return res.render(view, {
		representations: getRepresentationsViewModel(representations, caseId),
		caseReference: getCaseReferenceViewModel(caseData),
		caseId,
		publishQueueURL: getPublishQueueUrl(publishableReps, serviceUrl, caseId),
		resetSuccessBannerURL: `?${queryString}`,
		publishedRepsCount: Number(publishedRepsCount),
		unpublishedRepsCount: Number(unpublishedRepsCount),
		allPublishedReps: allPublishedReps,
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
		showUnpublishedRepUpdatesBanner: hasUnpublishedRepUpdates(publishableReps),
		keyDates: await getKeyDates(publishedDate, repsPeriodCloseDate, repsPeriodCloseDateExtension),
		clearFilterRefreshUrl: url('representations', { caseId })
	});
}
