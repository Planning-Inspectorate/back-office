import {
	getExaminationLibraryDocumentsByCategory,
	getExaminationLibraryDocumentsByTimetableItem,
	publishExaminationLibraryCategory
} from './applications-examination-library.service.js';
import { getExaminationLibraryPublishViewModel } from './applications-examination-library-publish.view-model.js';
import { categoryCodes, examinationLibrarySections } from './examination-library.constants.js';
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
 * Get Examination Library category check details and publish page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { case: { title: string } }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibraryPublish(request, response) {
	const { caseId, slug: itemSlug } = request.params;
	const { sortBy, pageSize = 25, page = 1 } = request.query;
	const caseIdNumber = Number(caseId);
	const pageNumber = Number(page) || 1;
	const pageSizeNumber = Number(pageSize) || 25;

	const projectName = response.locals?.case?.title || '';
	const timetable = await getCaseTimetableItems(caseIdNumber);
	const dynamicSections = getDynamicSectionsFromTimetable(timetable?.items);

	const section = getSectionByItemSlug(examinationLibrarySections, dynamicSections, itemSlug);

	if (!section) {
		return response.status(404).render('app/404');
	}

	const sectionCategoryCode = getCategoryCode(section, categoryCodes);
	const sectionItem = section.items.find((item) => item.href === itemSlug);

	if (!sectionItem) {
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

	let publishedDocumentsResponse = {
		page: pageNumber,
		pageSize: pageSizeNumber,
		pageCount: 1,
		itemCount: 0,
		items: []
	};

	let allDocumentsResponse = {
		page: 1,
		pageSize: 1,
		pageCount: 1,
		itemCount: 0,
		items: []
	};

	if (sectionCategoryCode) {
		[publishedDocumentsResponse, allDocumentsResponse] = await Promise.all([
			getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, publishedQueryString),
			getExaminationLibraryDocumentsByCategory(caseId, sectionCategoryCode, allQueryString)
		]);
	} else if (sectionItem?.examinationTimetableItemId) {
		[publishedDocumentsResponse, allDocumentsResponse] = await Promise.all([
			getExaminationLibraryDocumentsByTimetableItem(
				caseId,
				sectionItem.examinationTimetableItemId,
				publishedQueryString
			),
			getExaminationLibraryDocumentsByTimetableItem(
				caseId,
				sectionItem.examinationTimetableItemId,
				allQueryString
			)
		]);
	}

	/** @type {ExaminationLibraryDocumentVersion[]} */
	const sectionDocuments = publishedDocumentsResponse?.items ?? [];
	const totalPublishedCount = publishedDocumentsResponse?.itemCount ?? 0;
	const totalAllCount = allDocumentsResponse?.itemCount ?? 0;
	const unpublishedCount = Math.max(0, totalAllCount - totalPublishedCount);

	const publishUrl = url('examination-library-publish', {
		caseId: caseIdNumber,
		slug: itemSlug
	});

	// TODO: Add a guard to redirect or reject requests when totalPublishedCount is zero. Do not render the publish review screen for an empty category.
	const viewModel = getExaminationLibraryPublishViewModel({
		section,
		sectionDocuments,
		totalPublishedCount,
		unpublishedCount,
		itemSlug,
		caseId: caseIdNumber,
		projectName,
		publishUrl
	});

	if (!viewModel) {
		return response.status(404).render('app/404');
	}

	return response.render('applications/case-examination-library/examination-library-publish.njk', {
		...viewModel,
		caseId,
		projectName,
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
 * @param {import('express').Response} response
 * @returns {Promise<void>}
 */
export async function postExaminationLibraryPublish(request, response) {
	// TODO: Validate that the category contains documents before publishing. Reject publication if the document list is empty.
	const { caseId, slug: itemSlug } = request.params;
	const caseIdNumber = Number(caseId);

	const timetable = await getCaseTimetableItems(caseIdNumber);
	const dynamicSections = getDynamicSectionsFromTimetable(timetable?.items);

	const section = getSectionByItemSlug(examinationLibrarySections, dynamicSections, itemSlug);

	if (!section) {
		return response.status(404).render('app/404');
	}

	const sectionCategoryCode = getCategoryCode(section, categoryCodes);

	if (!sectionCategoryCode) {
		return response.status(404).render('app/404');
	}

	await publishExaminationLibraryCategory(caseId, { categoryCode: sectionCategoryCode });

	const redirectUrl = `${url('examination-library-section', {
		caseId: caseIdNumber,
		slug: itemSlug
	})}?published=true`;

	return response.redirect(redirectUrl);
}
