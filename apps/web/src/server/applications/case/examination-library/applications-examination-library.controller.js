import { getExaminationLibraryIndexViewModel } from './applications-examination-library-index.view-model.js';
import {
	categoryCodes,
	DEFAULT_SECTION_STATUS,
	examinationLibrarySections
} from './examination-library.constants.js';
import { getCaseTimetableItems } from '../examination-timetable/applications-timetable.service.js';
import { getDynamicSectionsFromTimetable } from './applications-examination-library-utils.js';
import { getExaminationLibraryCategories } from './applications-examination-library.service.js';

/**
 * Get Examination Library index page
 *
 * @param {{ params: { caseId: string } }} request
 * @param {*} response
 */
export async function getExaminationLibraryIndex(request, response) {
	const { caseId } = request.params;
	const caseIdNumber = Number(caseId);

	const [timetable, categoriesResponse] = await Promise.all([
		getCaseTimetableItems(caseIdNumber),
		getExaminationLibraryCategories(caseIdNumber).catch(() => [])
	]);

	const dynamicSections = getDynamicSectionsFromTimetable(timetable?.items);
	const categories = categoriesResponse ?? [];

	/**
	 * @param {string | undefined} status
	 * @returns {import('@pins/applications/lib/status-utils.js').ApplicationStatus}
	 */
	const formatStatus = (status) =>
		status
			? /** @type {import('@pins/applications/lib/status-utils.js').ApplicationStatus} */ (
					status.toLowerCase().replace(/\s+/g, '-')
				)
			: DEFAULT_SECTION_STATUS;

	const allSections = [...examinationLibrarySections, ...dynamicSections];
	const statusBySlug = new Map(allSections.map(({ slug }) => [slug, DEFAULT_SECTION_STATUS]));

	const typedCategoryCodes = /** @type {Record<string, string>} */ (categoryCodes);

	for (const category of categories) {
		const slug =
			typedCategoryCodes[category.categoryCode] ||
			category.categoryName?.toLowerCase()?.replace(/\s+/g, '-');
		if (slug) {
			statusBySlug.set(slug, formatStatus(category.publishedStatus));
		}
	}

	const sectionStatuses = Array.from(statusBySlug.entries()).map(([slug, status]) => ({
		slug,
		status
	}));

	const indexViewModel = getExaminationLibraryIndexViewModel({
		caseId: caseIdNumber,
		dynamicSections,
		sectionStatuses
	});

	return response.render(
		`applications/case-examination-library/examination-library-index.njk`,
		indexViewModel
	);
}
