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
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibrarySectionDocument} ExaminationLibrarySectionDocument
 */

/**
 * Get Examination Library section data.
 *
 * @param {number} caseId
 * @param {string} itemSlug
 * @param {Record<string, any>} [query={}]
 * @param {{ categoriesResponse?: any[], documentsResponse?: any }} [prefetchedData={}]
 * @param {string} [caseTitle='']
 * @returns {Promise<{
 *   sectionViewModel: any,
 *   documentsResponse: any,
 *   sectionUrl: string,
 *   publishUrl: string,
 *   updateUrl: string,
 *   hasUpdatesToPublish: boolean,
 *   unpublishUrl: string,
 *   sectionStatus: string,
 *   isPublishedQuery: boolean,
 *   isUnpublishedQuery: boolean,
 *   showSuccessBanner: boolean,
 *   successBannerHeading: string
 * } | null>}
 */
export async function getExaminationLibrarySectionData(
	caseId,
	itemSlug,
	query = {},
	prefetchedData = {},
	caseTitle = ''
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

	/** @type {ExaminationLibrarySectionDocument[]} */
	const sectionDocuments = documentsResponse?.items ?? [];

	const matchingCategory = categoriesResponse?.find((c) => c.categoryCode === sectionCategoryCode);
	const dbCategoryStatus = matchingCategory?.publishedStatus;
	const isPublishedQuery = query.published === 'true';
	const isUnpublishedQuery = query.unpublished === 'true';

	let sectionStatus = dbCategoryStatus || DEFAULT_SECTION_STATUS;
	if (isPublishedQuery) {
		sectionStatus = 'published';
	} else if (isUnpublishedQuery) {
		sectionStatus = 'unpublished';
	}

	const sectionUrl = url('examination-library-section', { caseId, slug: itemSlug });
	const publishUrl = url('examination-library-publish', { caseId, slug: itemSlug });
	const updateUrl = url('examination-library-update', { caseId, slug: itemSlug });
	const unpublishUrl = url('examination-library-unpublish', { caseId, slug: itemSlug });

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
		sectionDocuments,
		sectionStatus,
		itemSlug,
		query,
		sectionUrl,
		caseTitle
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
		isPublishedQuery,
		isUnpublishedQuery,
		showSuccessBanner: sectionViewModel.showSuccessBanner,
		successBannerHeading: sectionViewModel.successBannerHeading
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
	const caseTitle = response.locals?.case?.title || '';

	const sectionData = await getExaminationLibrarySectionData(
		caseId,
		itemSlug,
		request.query,
		{},
		caseTitle
	);

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
		pagination: getExaminationLibraryPagination(
			request.query,
			sectionData.documentsResponse,
			sectionData.sectionUrl
		)
	});
}
