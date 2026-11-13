import {
	getExaminationLibraryCategories,
	getExaminationLibraryDocumentsByCategory,
	publishExaminationLibraryCategory
} from './applications-examination-library.service.js';
import { getExaminationLibraryPublishViewModel } from './applications-examination-library-publish.view-model.js';
import { getExaminationLibrarySectionData } from './applications-examination-library-section.controller.js';
import { categoryCodes, examinationLibrarySections } from './examination-library.constants.js';
import {
	getSectionByItemSlug,
	getCategoryCode,
	getExaminationLibraryPagination
} from './applications-examination-library-utils.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import { url } from '../../../lib/nunjucks-filters/index.js';

const EMPTY_CATEGORY_ERROR =
	'Examination library category does not contain any new published documents';

/**
 * Render the category section page with an error summary banner.
 *
 * @param {import('express').Response} response
 * @param {any} sectionData
 * @param {number} caseId
 * @param {Record<string, any>} query
 * @param {string} errors
 * @returns {void}
 */
export function renderSectionPageWithError(response, sectionData, caseId, query, errors) {
	return response.render('applications/case-examination-library/examination-library-section.njk', {
		...sectionData.sectionViewModel,
		caseId,
		publishUrl: sectionData.publishUrl,
		pagination: getExaminationLibraryPagination(
			query,
			sectionData.documentsResponse,
			sectionData.sectionUrl
		),
		errors
	});
}

/**
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibraryDocumentVersion} ExaminationLibraryDocumentVersion
 */

/**
 * Get Examination Library category check details and publish page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { case: { title: string }, caseId?: number }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibraryPublish(request, response) {
	const { caseId: paramCaseId, slug: itemSlug } = request.params;
	const { sortBy, pageSize = 25, page = 1 } = request.query;
	const caseId = response.locals?.caseId || Number(paramCaseId);
	const pageNumber = Number(page) || 1;
	const pageSizeNumber = Number(pageSize) || 25;

	const section = getSectionByItemSlug(examinationLibrarySections, itemSlug);
	const sectionCategoryCode = section ? getCategoryCode(section, categoryCodes) : '';

	if (!section || !sectionCategoryCode) {
		return response.status(404).render('app/404');
	}

	const publishedQueryString = buildQueryString({
		sortBy,
		pageSize: pageSizeNumber,
		page: pageNumber,
		publishedStatus: 'published'
	});

	const allQueryString = buildQueryString({
		pageSize: 1,
		page: 1
	});

	const [publishedDocumentsResponse, allDocumentsResponse, categoriesResponse] = await Promise.all([
		getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, publishedQueryString),
		getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, allQueryString),
		getExaminationLibraryCategories(caseId, { categoryCode: sectionCategoryCode }).catch(() => [])
	]);

	/** @type {ExaminationLibraryDocumentVersion[]} */
	const sectionDocuments = publishedDocumentsResponse?.items ?? [];
	const totalPublishedCount = publishedDocumentsResponse?.itemCount ?? 0;
	const totalAllCount = allDocumentsResponse?.itemCount ?? 0;
	const unpublishedCount = Math.max(0, totalAllCount - totalPublishedCount);

	const matchingCategory = categoriesResponse?.find((c) => c.categoryCode === sectionCategoryCode);
	const categoryStatus = matchingCategory?.publishedStatus?.toLowerCase();

	// category cannot be published if it is already published, or has no published documents
	if (categoryStatus === 'published' || totalPublishedCount === 0) {
		const sectionData = await getExaminationLibrarySectionData(caseId, itemSlug, request.query, {
			categoriesResponse
		});
		if (!sectionData) {
			return response.status(404).render('app/404');
		}

		return renderSectionPageWithError(
			response,
			sectionData,
			caseId,
			request.query,
			EMPTY_CATEGORY_ERROR
		);
	}

	const publishUrl = url('examination-library-publish', {
		caseId,
		slug: itemSlug
	});

	const viewModel = getExaminationLibraryPublishViewModel({
		section,
		sectionDocuments,
		totalPublishedCount,
		unpublishedCount,
		itemSlug,
		caseId,
		publishUrl
	});

	if (!viewModel) {
		return response.status(404).render('app/404');
	}

	return response.render('applications/case-examination-library/examination-library-publish.njk', {
		...viewModel,
		caseId: paramCaseId || caseId,
		pagination: getExaminationLibraryPagination(
			request.query,
			publishedDocumentsResponse,
			publishUrl
		)
	});
}

/**
 * Handle publishing Examination Library category.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { caseId?: number }>} response
 * @returns {Promise<void>}
 */
export async function postExaminationLibraryPublish(request, response) {
	const { slug: itemSlug } = request.params;
	const caseId = response.locals?.caseId || Number(request.params?.caseId);

	const section = getSectionByItemSlug(examinationLibrarySections, itemSlug);
	const sectionCategoryCode = section ? getCategoryCode(section, categoryCodes) : '';

	if (!section || !sectionCategoryCode) {
		return response.status(404).render('app/404');
	}

	try {
		await publishExaminationLibraryCategory(caseId, { categoryCode: sectionCategoryCode });
	} catch (error) {
		const apiError = /** @type {any} */ (error);
		if (apiError?.response?.statusCode === 400 || apiError?.statusCode === 400) {
			const sectionData = await getExaminationLibrarySectionData(caseId, itemSlug, request.query);
			if (!sectionData) {
				return response.status(404).render('app/404');
			}

			const errorMessage =
				apiError?.response?.body?.errors || apiError?.message || EMPTY_CATEGORY_ERROR;

			return renderSectionPageWithError(response, sectionData, caseId, request.query, errorMessage);
		}
		throw error;
	}

	return response.redirect(
		`${url('examination-library-section', { caseId, slug: itemSlug })}?published=true`
	);
}
