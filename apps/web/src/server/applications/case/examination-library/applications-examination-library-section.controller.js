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
 * Get Examination Library section data.
 *
 * @param {number} caseId
 * @param {string} itemSlug
 * @param {Record<string, any>} [query={}]
 * @param {{ categoriesResponse?: any[], documentsResponse?: any }} [prefetchedData={}]
 * @returns {Promise<{
 *   sectionViewModel: any,
 *   documentsResponse: any,
 *   sectionUrl: string,
 *   publishUrl: string,
 *   sectionStatus: string,
 *   isPublishedQuery: boolean
 * } | null>}
 */
export async function getExaminationLibrarySectionData(
	caseId,
	itemSlug,
	query = {},
	prefetchedData = {}
) {
	const { sortBy, pageSize = 25, page = 1 } = query;
	const pageNumber = Number(page) || 1;
	const pageSizeNumber = Number(pageSize) || 25;

	const section = getSectionByItemSlug(examinationLibrarySections, itemSlug);
	const sectionCategoryCode = section ? getCategoryCode(section, categoryCodes) : '';

	if (!section || !sectionCategoryCode) {
		return null;
	}

	const queryString = buildQueryString({
		sortBy,
		pageSize: pageSizeNumber,
		page: pageNumber
	});

	const [documentsResponse, categoriesResponse] = await Promise.all([
		prefetchedData.documentsResponse ||
			getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, queryString),
		prefetchedData.categoriesResponse ||
			getExaminationLibraryCategories(caseId, { categoryCode: sectionCategoryCode }).catch(() => [])
	]);

	/** @type {ExaminationLibraryDocumentVersion[]} */
	const sectionDocuments = documentsResponse?.items ?? [];

	const matchingCategory = categoriesResponse?.find((c) => c.categoryCode === sectionCategoryCode);
	const dbCategoryStatus = matchingCategory?.publishedStatus;
	const isPublishedQuery = query.published === 'true';

	const sectionStatus = isPublishedQuery ? 'published' : dbCategoryStatus || DEFAULT_SECTION_STATUS;

	const sectionUrl = url('examination-library-section', { caseId, slug: itemSlug });
	const publishUrl = url('examination-library-publish', { caseId, slug: itemSlug });

	const sectionViewModel = getExaminationLibrarySectionViewModel({
		sectionDocuments,
		sectionStatus,
		itemSlug,
		query,
		sectionUrl
	});

	if (!sectionViewModel) {
		return null;
	}

	return {
		sectionViewModel,
		documentsResponse,
		sectionUrl,
		publishUrl,
		sectionStatus,
		isPublishedQuery
	};
}

/**
 * Get Examination Library section detail page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { case: { title: string }, caseId?: number }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibrarySection(request, response) {
	const { slug: itemSlug } = request.params;
	const caseId = response.locals?.caseId || Number(request.params?.caseId);

	const sectionData = await getExaminationLibrarySectionData(caseId, itemSlug, request.query);

	if (!sectionData) {
		return response.status(404).render('app/404');
	}

	return response.render('applications/case-examination-library/examination-library-section.njk', {
		...sectionData.sectionViewModel,
		caseId,
		publishUrl: sectionData.publishUrl,
		showSuccessBanner: sectionData.isPublishedQuery,
		pagination: getExaminationLibraryPagination(
			request.query,
			sectionData.documentsResponse,
			sectionData.sectionUrl
		)
	});
}
