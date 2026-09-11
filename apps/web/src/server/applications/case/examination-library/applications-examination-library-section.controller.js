import { getExaminationLibraryDocumentsByCategory } from './applications-examination-library.service.js';
import { getExaminationLibrarySectionViewModel } from './applications-examination-library-section.view-model.js';
import {
	categoryCodes,
	examinationLibrarySections,
	placeHolderDynamicSections,
	placeholderSectionStatus
} from './examination-library.constants.js';
import { getSectionByItemSlug } from './applications-examination-library-utils.js';

/**
 * Get Examination Library section detail page.
 *
 * @param {import('express').Request<{ caseId: string, slug: string }>} request
 * @param {import('express').Response<any, { case: { title: string } }>} response
 * @returns {Promise<void>}
 */
export async function getExaminationLibrarySection(request, response) {
	const { caseId, slug: itemSlug } = request.params;
	const projectName = response.locals.case.title;
	const dynamicSections = placeHolderDynamicSections;

	const section = getSectionByItemSlug(examinationLibrarySections, dynamicSections, itemSlug);

	if (!section) {
		return response.status(404).render('app/404');
	}

	const sectionSlug = section.slug;
	const categoryCodeKeys = /** @type {Array<keyof typeof categoryCodes>} */ (
		Object.keys(categoryCodes)
	);
	const sectionCategoryCode = categoryCodeKeys.find((key) => categoryCodes[key] === sectionSlug);

	if (!sectionCategoryCode) {
		return response.status(404).render('app/404');
	}

	const sectionDocuments = await getExaminationLibraryDocumentsByCategory(
		caseId,
		sectionCategoryCode
	);
	const sectionStatus =
		/** @type {import('@pins/applications/lib/status-utils.js').ApplicationStatus} */ (
			placeholderSectionStatus
		);

	const sectionViewModel = getExaminationLibrarySectionViewModel({
		dynamicSections,
		sectionDocuments,
		sectionStatus,
		itemSlug
	});

	if (!sectionViewModel) {
		return response.status(404).render('app/404');
	}

	return response.render(`applications/case-examination-library/examination-library-section.njk`, {
		...sectionViewModel,
		caseId,
		projectName
	});
}
