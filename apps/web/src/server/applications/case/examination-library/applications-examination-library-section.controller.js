import {
	getExaminationLibraryCategories,
	getExaminationLibraryDocumentsByCategory
} from './applications-examination-library.service.js';
import { getExaminationLibrarySectionViewModel } from './applications-examination-library-section.view-model.js';
import {
	categoryCodes,
	DEFAULT_SECTION_STATUS,
	examinationLibrarySections
} from './examination-library.constants.js';
import {
	getSectionByItemSlug,
	getCategoryCode,
	getExaminationLibraryPagination
} from './applications-examination-library-utils.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import { url } from '../../../lib/nunjucks-filters/index.js';

/**
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibraryDocumentVersion} ExaminationLibraryDocumentVersion
 */

/**
 * Get Examination Library section detail page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { case: { title: string }, caseId?: number }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibrarySection(request, response) {
	const { slug: itemSlug } = request.params;
	const { sortBy, pageSize = 25, page = 1 } = request.query;
	const caseId = response.locals?.caseId || Number(request.params?.caseId);
	const pageNumber = Number(page) || 1;
	const pageSizeNumber = Number(pageSize) || 25;

	const section = getSectionByItemSlug(examinationLibrarySections, itemSlug);
	const sectionCategoryCode = section ? getCategoryCode(section, categoryCodes) : '';

	if (!section || !sectionCategoryCode) {
		return response.status(404).render('app/404');
	}

	const queryString = buildQueryString({
		sortBy,
		pageSize: pageSizeNumber,
		page: pageNumber
	});

	const [documentsResponse, categoriesResponse] = await Promise.all([
		getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, queryString),
		getExaminationLibraryCategories(caseId, { categoryCode: sectionCategoryCode }).catch(() => [])
	]);

	/** @type {ExaminationLibraryDocumentVersion[]} */
	const sectionDocuments = documentsResponse?.items ?? [];

	const matchingCategory = categoriesResponse?.find((c) => c.categoryCode === sectionCategoryCode);
	const dbCategoryStatus = matchingCategory?.publishedStatus;
	const isPublishedQuery = request.query.published === 'true';

	const sectionStatus = isPublishedQuery ? 'published' : dbCategoryStatus || DEFAULT_SECTION_STATUS;

	const sectionUrl = url('examination-library-section', { caseId, slug: itemSlug });
	const publishUrl = url('examination-library-publish', { caseId, slug: itemSlug });

	const sectionViewModel = getExaminationLibrarySectionViewModel({
		sectionDocuments,
		sectionStatus,
		itemSlug,
		query: request.query,
		sectionUrl
	});

	if (!sectionViewModel) {
		return response.status(404).render('app/404');
	}

	return response.render('applications/case-examination-library/examination-library-section.njk', {
		...sectionViewModel,
		caseId,
		publishUrl,
		showSuccessBanner: isPublishedQuery,
		pagination: getExaminationLibraryPagination(request.query, documentsResponse, sectionUrl)
	});
}
