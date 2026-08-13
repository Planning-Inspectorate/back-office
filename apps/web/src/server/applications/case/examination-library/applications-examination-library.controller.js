import { getExaminationLibraryIndexViewModel } from './applications-examination-library-index.view-model.js';
import { placeholderSectionStatuses } from './examination-library.constants.js';

/**
 * Get Examination Library index page
 *
 * @param {{ params: { caseId: string } }} request
 * @param {*} response
 */
export async function getExaminationLibraryIndex(request, response) {
	const { caseId } = request.params;

	const indexViewModel = getExaminationLibraryIndexViewModel({
		caseId: Number(caseId),
		sectionStatuses: placeholderSectionStatuses
	});

	return response.render(
		`applications/case-examination-library/examination-library-index.njk`,
		indexViewModel
	);
}
