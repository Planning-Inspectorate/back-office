import {
	getCategoryCode,
	getExaminationLibraryPagination,
	getSectionByItemSlug
} from './applications-examination-library-utils.js';
import { categoryCodes, examinationLibrarySections } from './examination-library.constants.js';
import { buildQueryString } from '../../common/components/build-query-string.js';
import {
	getExaminationLibraryCategories,
	getExaminationLibraryDocumentsByCategory
} from './applications-examination-library.service.js';
import { getExaminationLibraryUnpublishViewModel } from './applications-examination-library-unpublish.view-model.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import { unpublishExaminationLibraryCategory } from './applications-examination-library.service.js';
import { getExaminationLibrarySectionData } from './applications-examination-library-section.controller.js';
import { renderSectionPageWithError } from './applications-examination-library-publish.controller.js';

const UNPUBLISH_CATEGORY_ERROR =
	'This examination library category is not published, so cannot be unpublished';

/**
 * @typedef {import('./applications-examination-library-utils.js').ExaminationLibrarySectionDocument} ExaminationLibrarySectionDocument
 */

/**
 * Get Examination Library category unpublish page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} req
 * @param {import('express').Response<any, { caseId?: number }>} res
 * @returns {Promise<void>}
 */
export async function getExaminationLibraryUnpublish(req, res) {
	const { slug: itemSlug } = req.params;
	const { sortBy, pageSize = 25, page = 1 } = req.query;
	const caseId = res.locals?.caseId || Number(req.params?.caseId);
	const pageNumber = Number(page) || 1;
	const pageSizeNumber = Number(pageSize) || 25;

	const section = getSectionByItemSlug(examinationLibrarySections, itemSlug);
	const sectionCategoryCode = section ? getCategoryCode(section, categoryCodes) : '';

	if (!section || !sectionCategoryCode) {
		return res.status(404).render('app/404');
	}

	const queryString = buildQueryString({
		sortBy,
		pageSize: pageSizeNumber,
		page: pageNumber,
		examinationRefNo: true
	});

	const [categoryDocumentsResponse, categoriesResponse] = await Promise.all([
		getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, queryString),
		getExaminationLibraryCategories(caseId, { categoryCode: sectionCategoryCode }).catch(() => [])
	]);

	const categoryDocuments = categoryDocumentsResponse?.items ?? [];
	const filteredDocuments = categoryDocuments.filter(
		(/** @type {ExaminationLibrarySectionDocument} */ document) =>
			Object.keys(document.latestDocumentVersion ?? {}).length
	);

	const matchingCategory = categoriesResponse?.find((c) => c.categoryCode === sectionCategoryCode);
	const categoryStatus = matchingCategory?.publishedStatus?.toLowerCase();

	if (categoryStatus !== 'published') {
		const sectionData = await getExaminationLibrarySectionData(caseId, itemSlug, req.query, {
			categoriesResponse
		});

		if (!sectionData) {
			return res.status(404).render('app/404');
		}

		return renderSectionPageWithError(
			res,
			sectionData,
			caseId,
			req.query,
			UNPUBLISH_CATEGORY_ERROR
		);
	}

	const unpublishViewModel = getExaminationLibraryUnpublishViewModel({
		caseId,
		filteredDocuments,
		itemSlug,
		section
	});

	if (!unpublishViewModel) {
		return res.status(404).render('app/404');
	}

	const unpublishUrl = url('examination-library-unpublish', { caseId, slug: itemSlug });

	return res.render('applications/case-examination-library/examination-library-unpublish.njk', {
		...unpublishViewModel,
		pagination: getExaminationLibraryPagination(req.query, categoryDocumentsResponse, unpublishUrl)
	});
}

/**
 * Handle unpublishing Examination Library category.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} req
 * @param {import('express').Response<any, { caseId?: number }>} res
 * @returns {Promise<void>}
 */
export async function postExaminationLibraryUnpublish(req, res) {
	const { slug: itemSlug } = req.params;
	const caseId = res.locals?.caseId || Number(req.params?.caseId);

	const section = getSectionByItemSlug(examinationLibrarySections, itemSlug);
	const sectionCategoryCode = section ? getCategoryCode(section, categoryCodes) : '';

	if (!section || !sectionCategoryCode) {
		return res.status(404).render('app/404');
	}

	try {
		await unpublishExaminationLibraryCategory(caseId, { categoryCode: sectionCategoryCode });
	} catch (error) {
		const apiError = /** @type {any} */ (error);
		if (apiError?.response?.statusCode === 400 || apiError?.statusCode === 400) {
			const sectionData = await getExaminationLibrarySectionData(caseId, itemSlug, req.query);
			if (!sectionData) {
				return res.status(404).render('app/404');
			}

			const errorMessage =
				apiError?.response?.body?.errors || apiError?.message || UNPUBLISH_CATEGORY_ERROR;

			return renderSectionPageWithError(res, sectionData, caseId, req.query, errorMessage);
		}
		throw error;
	}

	return res.redirect(`${url('examination-library-section', { caseId, slug: itemSlug })}`);
}
