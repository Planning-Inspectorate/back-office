import {
	getExaminationLibraryDocumentsByCategory,
	getExaminationLibraryDocumentsByTimetableItem,
	getExaminationLibraryCategories
} from './applications-examination-library.service.js';
import { getExaminationLibrarySectionViewModel } from './applications-examination-library-section.view-model.js';
import {
	categoryCodes,
	examinationLibrarySections,
	DEFAULT_SECTION_STATUS
} from './examination-library.constants.js';
import {
	getSectionByItemSlug,
	getCategoryCode,
	getExaminationLibraryPagination,
	getDynamicSectionsFromTimetable
} from './applications-examination-library-utils.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import { getCaseTimetableItems } from '../examination-timetable/applications-timetable.service.js';

/**
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibraryDocumentVersion} ExaminationLibraryDocumentVersion
 */

/**
 * Get Examination Library section detail page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { case: { title: string } }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibrarySection(request, response) {
	const { caseId, slug: itemSlug } = request.params;
	const { sortBy, pageSize = 25, page = 1 } = request.query;
	const caseIdNumber = Number(caseId);
	const pageNumber = Number(page) || 1;
	const pageSizeNumber = Number(pageSize) || 25;

	const projectName = response.locals.case.title;
	const timetable = await getCaseTimetableItems(caseIdNumber);
	const dynamicSections = getDynamicSectionsFromTimetable(timetable?.items);

	const section = getSectionByItemSlug(examinationLibrarySections, dynamicSections, itemSlug);

	if (!section) {
		return response.status(404).render('app/404');
	}

	const sectionCategoryCode = getCategoryCode(section, categoryCodes);
	const sectionItem = section.items.find((item) => item.href === itemSlug);
	const queryString = buildQueryString({
		sortBy,
		pageSize,
		page
	});

	let documentsResponse = {
		page: pageNumber,
		pageSize: pageSizeNumber,
		pageCount: 1,
		itemCount: 0,
		items: []
	};

	/** @type {Array<any>} */
	let categoriesResponse = [];

	if (sectionCategoryCode) {
		[documentsResponse, categoriesResponse] = await Promise.all([
			getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, queryString),
			getExaminationLibraryCategories(caseId, { categoryCode: sectionCategoryCode }).catch(() => [])
		]);
	} else if (sectionItem?.examinationTimetableItemId) {
		[documentsResponse, categoriesResponse] = await Promise.all([
			getExaminationLibraryDocumentsByTimetableItem(
				caseId,
				sectionItem.examinationTimetableItemId,
				queryString
			),
			getExaminationLibraryCategories(caseId).catch(() => [])
		]);
	}

	/** @type {ExaminationLibraryDocumentVersion[]} */
	const sectionDocuments = documentsResponse.items ?? [];

	const currentCategory = sectionCategoryCode
		? categoriesResponse?.[0]
		: categoriesResponse?.find(
				(cat) => cat.examinationTimetableItemId === sectionItem?.examinationTimetableItemId
			);

	const isPublishedQuery = request.query.published === 'true';
	const liveStatus = currentCategory?.publishedStatus
		? /** @type {import('@pins/applications/lib/status-utils.js').ApplicationStatus} */ (
				currentCategory.publishedStatus.toLowerCase().replace(/\s+/g, '-')
			)
		: DEFAULT_SECTION_STATUS;

	const sectionStatus = isPublishedQuery ? 'published' : liveStatus;

	const sectionUrl = url('examination-library-section', { caseId: caseIdNumber, slug: itemSlug });
	const publishUrl = url('examination-library-publish', { caseId: caseIdNumber, slug: itemSlug });

	const sectionViewModel = getExaminationLibrarySectionViewModel({
		dynamicSections,
		sectionDocuments,
		sectionStatus,
		itemSlug,
		query: request.query,
		sectionUrl
	});

	if (!sectionViewModel) {
		return response.status(404).render('app/404');
	}

	// TODO: Prevent access to the publish route when the category has zero documents. Omit publishUrl or block navigation for empty categories.
	return response.render('applications/case-examination-library/examination-library-section.njk', {
		...sectionViewModel,
		caseId,
		projectName,
		publishUrl,
		showSuccessBanner: isPublishedQuery,
		pagination: getExaminationLibraryPagination(request.query, documentsResponse, sectionUrl)
	});
}
