import { getExaminationLibraryIndexViewModel } from './applications-examination-library-index.view-model.js';
import { getExaminationLibraryCategories } from './applications-examination-library.service.js';

/**
 * Get Examination Library index page
 *
 * @param {import('express').Request<{ caseId: string }>} request
 * @param {import('express').Response<any, { caseId: number }>} response
 */
export async function getExaminationLibraryIndex(request, response) {
	const caseId = response.locals?.caseId || Number(request.params?.caseId);

	const categories = await getExaminationLibraryCategories(caseId).catch(() => []);

	return response.render(
		`applications/case-examination-library/examination-library-index.njk`,
		getExaminationLibraryIndexViewModel({
			caseId,
			categories
		})
	);
}
