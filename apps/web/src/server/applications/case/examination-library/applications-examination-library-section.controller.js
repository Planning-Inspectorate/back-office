import {
	getExaminationLibraryCategories,
	getExaminationLibraryDocumentsByCategory
} from './applications-examination-library.service.js';
import { getExaminationLibrarySectionViewModel } from './applications-examination-library-section.view-model.js';
import { DEFAULT_SECTION_STATUS } from './examination-library.constants.js';
import {
	getExaminationLibraryPagination,
	resolveExaminationLibraryCategory
} from './applications-examination-library-utils.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import { url } from '../../../lib/nunjucks-filters/index.js';

/**
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibrarySectionDocument} ExaminationLibrarySectionDocument
 */

/**
 * Get Examination Library section data.
 *
 * @param {number} caseId
 * @param {string} itemSlug
 * @param {Record<string, any>} [query={}]
 * @param {{ categoriesResponse?: any[], documentsResponse?: any, sectionSlug?: string }} [prefetchedData={}]
 * @returns {Promise<{
 *   sectionViewModel: any,
 *   documentsResponse: any,
 *   sectionUrl: string,
 *   publishUrl: string,
 *   updateUrl: string,
 *   hasUpdatesToPublish: boolean,
 *   unpublishUrl: string,
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

	const { sectionSlug } = prefetchedData;
	const categoriesResponse =
		prefetchedData.categoriesResponse || (await getExaminationLibraryCategories(caseId));
	const resolvedCategory = resolveExaminationLibraryCategory(
		itemSlug,
		sectionSlug,
		categoriesResponse
	);
	if (!resolvedCategory) {
		return null;
	}
	const { section, categoryCode: sectionCategoryCode } = resolvedCategory;

	const queryString = buildQueryString({
		sortBy,
		pageSize: pageSizeNumber,
		page: pageNumber
	});

	const documentsResponse =
		prefetchedData.documentsResponse ||
		(await getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, queryString));

	/** @type {ExaminationLibrarySectionDocument[]} */
	const sectionDocuments = documentsResponse?.items ?? [];

	const matchingCategory = categoriesResponse?.find((c) => c.categoryCode === sectionCategoryCode);
	const dbCategoryStatus = matchingCategory?.publishedStatus;
	const isPublishedQuery = query.published === 'true';

	const sectionStatus = isPublishedQuery ? 'published' : dbCategoryStatus || DEFAULT_SECTION_STATUS;

	const categorySlug = sectionSlug ? `${sectionSlug}/${itemSlug}` : itemSlug;
	const sectionUrl = url('examination-library-section', {
		caseId,
		slug: categorySlug
	});

	const publishUrl = url('examination-library-publish', { caseId, slug: categorySlug });
	const updateUrl = url('examination-library-update', { caseId, slug: categorySlug });
	const unpublishUrl = url('examination-library-unpublish', { caseId, slug: categorySlug });

	/** @param {ExaminationLibrarySectionDocument} doc */
	const isAwaitingELPublication = (doc) =>
		!doc?.isDeleted &&
		doc?.latestDocumentVersion?.publishedStatus?.toLowerCase() === 'published' &&
		!doc?.latestDocumentVersion?.examinationLibraryReferenceLocked;

	const isPublishedSection = sectionStatus.toLowerCase() === 'published';
	let hasUpdatesToPublish = false;

	if (isPublishedSection) {
		hasUpdatesToPublish = sectionDocuments.some(isAwaitingELPublication);

		if (!hasUpdatesToPublish && (documentsResponse?.pageCount ?? 1) > 1) {
			const [publishedCountResponse, lockedCountResponse] = await Promise.all([
				getExaminationLibraryDocumentsByCategory(
					caseId,
					sectionCategoryCode,
					buildQueryString({ publishedStatus: 'published', pageSize: 1, page: 1 })
				),
				getExaminationLibraryDocumentsByCategory(
					caseId,
					sectionCategoryCode,
					buildQueryString({
						publishedStatus: 'published',
						examinationRefNo: 'true',
						pageSize: 1,
						page: 1
					})
				)
			]);

			const totalPublished = publishedCountResponse?.itemCount ?? 0;
			const totalLocked = lockedCountResponse?.itemCount ?? 0;
			hasUpdatesToPublish = totalPublished > totalLocked;
		}
	}

	const sectionViewModel = getExaminationLibrarySectionViewModel({
		section,
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
		updateUrl,
		hasUpdatesToPublish,
		unpublishUrl,
		sectionStatus,
		isPublishedQuery
	};
}

/**
 * Get Examination Library section detail page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string, sectionSlug?: string }>} request
 * @param {import('express').Response<any, { case: { title: string }, caseId?: number }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibrarySection(request, response) {
	const { slug: itemSlug, sectionSlug } = request.params;
	const caseId = response.locals?.caseId || Number(request.params?.caseId);

	const sectionData = await getExaminationLibrarySectionData(caseId, itemSlug, request.query, {
		sectionSlug
	});

	if (!sectionData) {
		return response.status(404).render('app/404');
	}

	return response.render('applications/case-examination-library/examination-library-section.njk', {
		...sectionData.sectionViewModel,
		caseId,
		publishUrl: sectionData.publishUrl,
		updateUrl: sectionData.updateUrl,
		hasUpdatesToPublish: sectionData.hasUpdatesToPublish,
		unpublishUrl: sectionData.unpublishUrl,
		showSuccessBanner: sectionData.isPublishedQuery,
		pagination: getExaminationLibraryPagination(
			request.query,
			sectionData.documentsResponse,
			sectionData.sectionUrl
		)
	});
}
