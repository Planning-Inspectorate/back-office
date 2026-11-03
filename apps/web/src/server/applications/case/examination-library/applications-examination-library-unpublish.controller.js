import {
	getCategoryCode,
	getExaminationLibraryPagination,
	getSectionByItemSlug
} from './applications-examination-library-utils.js';
import { categoryCodes, examinationLibrarySections } from './examination-library.constants.js';

import { buildQueryString } from '../../common/components/build-query-string.js';
import { getExaminationLibraryDocumentsByCategory } from './applications-examination-library.service.js';
import { getExaminationLibraryUnpublishViewModel } from './applications-examination-library-unpublish.view-model.js';
import { url } from '../../../lib/nunjucks-filters/index.js';
import { unpublishExaminationLibraryCategory } from './applications-examination-library.service.js';

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

	const categoryDocumentsResponse = await getExaminationLibraryDocumentsByCategory(
		caseId,
		sectionCategoryCode,
		queryString
	);

	const categoryDocuments = categoryDocumentsResponse?.items ?? [];

	const unpublishViewModel = getExaminationLibraryUnpublishViewModel({
		caseId,
		categoryDocuments,
		itemSlug,
		section
	});

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

	await unpublishExaminationLibraryCategory(caseId, { categoryCode: sectionCategoryCode });

	return res.redirect(`${url('examination-library-section', { caseId, slug: itemSlug })}`);
}
