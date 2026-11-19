import {
	getExaminationLibraryCategories,
	getExaminationLibraryDocumentsByCategory,
	publishExaminationLibraryCategory
} from './applications-examination-library.service.js';
import { getExaminationLibraryPublishViewModel } from './applications-examination-library-publish.view-model.js';
import { getExaminationLibrarySectionData } from './applications-examination-library-section.controller.js';
import {
	resolveExaminationLibraryCategory,
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
		updateUrl: sectionData.updateUrl,
		hasUpdatesToPublish: sectionData.hasUpdatesToPublish,
		pagination: getExaminationLibraryPagination(
			query,
			sectionData.documentsResponse,
			sectionData.sectionUrl
		),
		errors
	});
}

/**
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibrarySectionDocument} ExaminationLibrarySectionDocument
 */

/**
 * Render check details and publish/update page for an Examination Library category.
 *
 * @param {import('express').Request<{ caseId: string, slug: string, sectionSlug?: string }>} request
 * @param {import('express').Response<any, { case: { title: string }, caseId?: number }>} response
 * @param {{ isUpdate: boolean }} options
 * @returns {Promise<void>}
 */
async function renderCheckDetailsPage(request, response, { isUpdate }) {
	const { caseId: paramCaseId, slug: itemSlug, sectionSlug } = request.params;
	const { sortBy, pageSize = 25, page = 1 } = request.query;
	const caseId = response.locals?.caseId || Number(paramCaseId);
	const pageNumber = Number(page) || 1;
	const pageSizeNumber = Number(pageSize) || 25;

	const categories = await getExaminationLibraryCategories(caseId);
	const resolvedCategory = resolveExaminationLibraryCategory(itemSlug, sectionSlug, categories);
	if (!resolvedCategory) {
		return response.status(404).render('app/404');
	}
	const { section, categoryCode: sectionCategoryCode } = resolvedCategory;

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

	const lockedQueryString = buildQueryString({
		pageSize: 1,
		page: 1,
		publishedStatus: 'published',
		examinationRefNo: 'true'
	});

	const [publishedDocumentsResponse, allDocumentsResponse, lockedDocumentsResponse] =
		await Promise.all([
			getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, publishedQueryString),
			getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, allQueryString),
			isUpdate
				? getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, lockedQueryString)
				: null
		]);

	/** @type {ExaminationLibrarySectionDocument[]} */
	const sectionDocuments = publishedDocumentsResponse?.items ?? [];
	const totalPublishedCount = publishedDocumentsResponse?.itemCount ?? 0;
	const totalAllCount = allDocumentsResponse?.itemCount ?? 0;
	const unpublishedCount = Math.max(0, totalAllCount - totalPublishedCount);

	const matchingCategory = categories.find((c) => c.categoryCode === sectionCategoryCode);
	const categoryStatus = matchingCategory?.publishedStatus?.toLowerCase();

	const lockedPublishedCount = lockedDocumentsResponse?.itemCount ?? 0;
	const totalAwaitingELPublicationCount = Math.max(0, totalPublishedCount - lockedPublishedCount);

	let additionalCount = 0;
	let isInvalidState;

	if (isUpdate) {
		isInvalidState = categoryStatus !== 'published' || totalAwaitingELPublicationCount === 0;
		additionalCount = totalAwaitingELPublicationCount;
	} else {
		// category cannot be published if it is already published, or has no published documents
		isInvalidState = categoryStatus === 'published' || totalPublishedCount === 0;
	}

	if (isInvalidState) {
		const sectionData = await getExaminationLibrarySectionData(caseId, itemSlug, request.query, {
			categoriesResponse: categories,
			sectionSlug
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

	const categorySlug = sectionSlug ? `${sectionSlug}/${itemSlug}` : itemSlug;

	const actionUrl = url(isUpdate ? 'examination-library-update' : 'examination-library-publish', {
		caseId,
		slug: categorySlug
	});

	const viewModel = getExaminationLibraryPublishViewModel({
		section,
		sectionDocuments,
		totalPublishedCount,
		unpublishedCount,
		itemSlug,
		caseId,
		publishUrl: actionUrl,
		isUpdate,
		additionalCount,
		categoryCode: sectionCategoryCode,
		sectionSlug
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
			actionUrl
		)
	});
}

/**
 * Get Examination Library category check details and publish page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { case: { title: string }, caseId?: number }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibraryPublish(request, response) {
	return renderCheckDetailsPage(request, response, { isUpdate: false });
}

/**
 * Get Examination Library category check details and update page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { case: { title: string }, caseId?: number }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibraryUpdate(request, response) {
	return renderCheckDetailsPage(request, response, { isUpdate: true });
}

/**
 * Handle publishing Examination Library category.
 *
 * @param {import('express').Request<{ caseId: string, slug: string, sectionSlug?: string }>} request
 * @param {import('express').Response<any, { caseId?: number }>} response
 * @returns {Promise<void>}
 */
export async function postExaminationLibraryPublish(request, response) {
	const { slug: itemSlug, sectionSlug } = request.params;
	const caseId = response.locals?.caseId || Number(request.params?.caseId);

	const categories = await getExaminationLibraryCategories(caseId);
	const resolvedCategory = resolveExaminationLibraryCategory(itemSlug, sectionSlug, categories);

	if (!resolvedCategory) {
		return response.status(404).render('app/404');
	}

	const { categoryCode: sectionCategoryCode } = resolvedCategory;
	const categorySlug = sectionSlug ? `${sectionSlug}/${itemSlug}` : itemSlug;

	try {
		await publishExaminationLibraryCategory(caseId, { categoryCode: sectionCategoryCode });
	} catch (error) {
		const apiError = /** @type {any} */ (error);
		if (apiError?.response?.statusCode === 400 || apiError?.statusCode === 400) {
			const sectionData = await getExaminationLibrarySectionData(caseId, itemSlug, request.query, {
				categoriesResponse: categories,
				sectionSlug
			});
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
		`${url('examination-library-section', { caseId, slug: categorySlug })}?published=true`
	);
}

/**
 * Handle updating a published Examination Library category with additional documents.
 */
export const postExaminationLibraryUpdate = postExaminationLibraryPublish;
