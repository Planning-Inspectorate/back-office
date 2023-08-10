import { get, post, patch } from '../../../lib/request.js';

/**
 *
 * @param {number} appealId
 * @param {import('@pins/appeals/types/inspector.js').SiteVisitType} visitType
 * @param {string} visitDate
 * @param {string} visitStartTime
 * @param {string} visitEndTime
 */
export async function createSiteVisit(
	appealId,
	visitType,
	visitDate,
	visitStartTime,
	visitEndTime
) {
	return post(`appeals/${appealId}/site-visits`, {
		json: {
			visitDate,
			visitStartTime,
			visitEndTime,
			visitType
		}
	});
}

/**
 *
 * @param {number} appealId
 * @param {number} siteVisitId
 * @param {import('@pins/appeals/types/inspector.js').SiteVisitType} visitType
 * @param {string} visitDate
 * @param {string} visitStartTime
 * @param {string} visitEndTime
 */
export async function updateSiteVisit(
	appealId,
	siteVisitId,
	visitType,
	visitDate,
	visitStartTime,
	visitEndTime
) {
	return patch(`appeals/${appealId}/site-visits/${siteVisitId}`, {
		json: {
			visitDate,
			visitStartTime,
			visitEndTime,
			visitType
		}
	});
}

/**
 *
 * @param {number} appealId
 * @param {number} siteVisitId
 * @returns {Promise<import('@pins/appeals.api/src/server/endpoints/appeals.js').SingleSiteVisitDetailsResponse>}
 */
export async function getSiteVisit(appealId, siteVisitId) {
	return get(`appeals/${appealId}/site-visits/${siteVisitId}`);
}
