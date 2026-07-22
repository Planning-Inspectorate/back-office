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
