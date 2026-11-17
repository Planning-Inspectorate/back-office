import { getExaminationLibraryIndexViewModel } from './applications-examination-library-index.view-model.js';
import {
	categoryCodes,
	DEFAULT_SECTION_STATUS,
	examinationLibrarySections
} from './examination-library.constants.js';
import { getExaminationLibraryCategories } from './applications-examination-library.service.js';
import { getCategoryCode } from './applications-examination-library-utils.js';

/**
 * Get Examination Library index page
 *
 * @param {import('express').Request<{ caseId: string }>} request
 * @param {import('express').Response<any, { caseId: number }>} response
 */
export async function getExaminationLibraryIndex(request, response) {
	const caseId = response.locals?.caseId || Number(request.params?.caseId);

	const categories = await getExaminationLibraryCategories(caseId).catch(() => []);

	const sectionStatuses = examinationLibrarySections
		.filter((section) => Boolean(getCategoryCode(section, categoryCodes)))
		.map((section) => {
			const categoryCode = getCategoryCode(section, categoryCodes);
			const matchingCategory = categories.find((c) => c.categoryCode === categoryCode);

			return {
				slug: section.slug,
				status: matchingCategory?.publishedStatus || DEFAULT_SECTION_STATUS
			};
		});

	return response.render(
		`applications/case-examination-library/examination-library-index.njk`,
		getExaminationLibraryIndexViewModel({
			caseId,
			sectionStatuses
		})
	);
}
