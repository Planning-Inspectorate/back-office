import { initialiseAndMapAppealData } from '#lib/mappers/appeal.mapper.js';
import { removeActions } from '../appeal-details.mapper.js';

/**
 * @typedef {'unaccompanied'|'accompanied'|'accessRequired'} WebSiteVisitType
 */

/**
 *
 * @param {WebSiteVisitType} webVisitType
 * @returns {import('@pins/appeals/types/inspector.js').SiteVisitType}
 */
export function mapWebVisitTypeToApiVisitType(webVisitType) {
	switch (webVisitType) {
		case 'accessRequired':
			return 'access required';
		default:
			return webVisitType;
	}
}

/**
 *
 * @param {*} data
 * @param {string} currentRoute
 * @param {import('../../../app/auth/auth-session.service').SessionWithAuth} session
 * @returns {Promise<(SummaryListRowProperties|undefined)[]>}
 */
export async function buildSiteDetailsSummaryListRows(data, currentRoute, session) {
	const mappedData = await initialiseAndMapAppealData(data, currentRoute, session);

	const rows = [
		mappedData.appeal.siteAddress.display.summaryListItem,
		mappedData.appeal.lpaHealthAndSafety.display.summaryListItem,
		mappedData.appeal.appellantHealthAndSafety.display.summaryListItem
	];

	if (mappedData.appeal.neighbouringSite) {
		for (const site of mappedData.appeal.neighbouringSite) {
			rows.push(site.display.summaryListItem);
		}
	}

	rows.forEach((row) => removeActions(row));

	return rows;
}
