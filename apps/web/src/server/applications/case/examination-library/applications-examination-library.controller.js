import { getExaminationLibraryIndexViewModel } from './applications-examination-library-index.view-model.js';
import { placeholderSectionStatuses } from './examination-library.constants.js';
import { getCaseTimetableItems } from '../examination-timetable/applications-timetable.service.js';
import { getDynamicSectionsFromTimetable } from './applications-examination-library-utils.js';

/**
 * Get Examination Library index page
 *
 * @param {{ params: { caseId: string } }} request
 * @param {*} response
 */
export async function getExaminationLibraryIndex(request, response) {
	const { caseId } = request.params;
	const timetable = await getCaseTimetableItems(Number(caseId));

	const indexViewModel = getExaminationLibraryIndexViewModel({
		caseId: Number(caseId),
		dynamicSections: getDynamicSectionsFromTimetable(timetable?.items),
		sectionStatuses: placeholderSectionStatuses
	});

	return response.render(
		`applications/case-examination-library/examination-library-index.njk`,
		indexViewModel
	);
}
