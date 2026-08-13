import { getExaminationLibrarySectionViewModel } from './applications-examination-library-section.view-model.js';

/**
 * Get Examination Library section detail page
 *
 * @param {*} request
 * @param {*} response
 */
export async function getExaminationLibrarySection(request, response) {
	const { caseId, slug } = request.params;

	const sectionViewModel = getExaminationLibrarySectionViewModel({ slug });

	if (!sectionViewModel) {
		return response.status(404).render('app/404');
	}

	return response.render(`applications/case-examination-library/examination-library-section.njk`, {
		...sectionViewModel,
		caseId
	});
}
