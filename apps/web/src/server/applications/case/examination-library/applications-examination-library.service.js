import { get } from '../../../lib/request.js';

/**
 * @typedef {import('@pins/applications/lib/status-utils.js').ApplicationStatus} ApplicationStatus
 */

/**
 * Get examination library section statuses for a case
 *
 * @param {number} caseId
 * @returns {Promise<Array<{slug: string, status: ApplicationStatus}>>}
 */
export async function getExaminationLibrarySectionStatuses(caseId) {
	return get(`applications/${caseId}/examination-library/section-statuses`);
}

/**
 * Get documents for a given case and examination library category code
 *
 * @param { string} caseId
 * @param {string} categoryCode
 * @param {string} queryString
 * @returns {Promise<any>}
 */
export async function getExaminationLibraryDocumentsByCategory(caseId, categoryCode, queryString) {
	return get(
		`applications/${caseId}/examination-library/documents?categoryCode=${categoryCode}&${queryString}`
	);
}

/**
 * Get documents assigned to a dynamic category created from an examination timetable item.
 *
 * @param {string} caseId
 * @param {number} examinationTimetableItemId
 * @param {string} queryString
 * @returns {Promise<any>}
 */
export async function getExaminationLibraryDocumentsByTimetableItem(
	caseId,
	examinationTimetableItemId,
	queryString
) {
	return get(
		`applications/${caseId}/examination-library/documents?examinationTimetableItemId=${examinationTimetableItemId}&${queryString}`
	);
}
