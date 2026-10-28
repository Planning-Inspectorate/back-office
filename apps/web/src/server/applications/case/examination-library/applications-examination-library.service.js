import { get, post } from '../../../lib/request.js';
import { buildQueryString } from '../../common/components/build-query-string.js';

/**
 * @typedef {import('./examination-library.constants.js').ExaminationLibraryCategoryStatus} ExaminationLibraryCategoryStatus
 */

/**
 * Get examination library categories for a case
 *
 * @param {string | number} caseId
 * @param {{ categoryCode?: string }} [filters]
 * @returns {Promise<Array<{ id: number, caseId: number, categoryCode: string, categoryName: string, publishedStatus: string, examinationTimetableItemId?: number | null }>>}
 */
export async function getExaminationLibraryCategories(caseId, filters = {}) {
	const queryString = buildQueryString(filters);
	return get(`applications/${caseId}/examination-library${queryString ? `?${queryString}` : ''}`);
}

/**
 * Get documents for a given case and examination library category code
 *
 * @param {string | number} caseId
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
 * Publishes documents for an examination library category.
 *
 * @param {string | number} caseId
 * @param {{ categoryCode: string }} payload
 * @returns {Promise<any>}
 */
export async function publishExaminationLibraryCategory(caseId, payload) {
	return post(`applications/${caseId}/examination-library/publish`, { json: payload });
}
