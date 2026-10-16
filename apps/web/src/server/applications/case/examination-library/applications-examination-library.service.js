import { get, post } from '../../../lib/request.js';

/**
 * Get examination library categories for a case
 *
 * @param {string | number} caseId
 * @param {{ categoryCode?: string }} [filters]
 * @returns {Promise<Array<{ id: number, categoryCode: string, categoryName: string, publishedStatus: string, examinationTimetableItemId?: number | null }>>}
 */
export async function getExaminationLibraryCategories(caseId, filters = {}) {
	const query = filters.categoryCode ? `?categoryCode=${filters.categoryCode}` : '';
	return get(`applications/${caseId}/examination-library${query}`);
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

/**
 * Publishes documents for an examination library category.
 *
 * @param {string | number} caseId
 * @param {{ categoryCode: string }} payload
 * @returns {Promise<any>}
 */
export async function publishExaminationLibraryCategory(caseId, payload) {
	return post(`applications/${caseId}/examination-library/publish`, { json: payload });
}
