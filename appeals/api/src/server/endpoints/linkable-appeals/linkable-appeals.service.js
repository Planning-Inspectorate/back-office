import appealRepository from '#repositories/appeal.repository.js';
import { getAppealFromHorizon } from '#utils/horizon-gateway.js';
import { formatLinkableAppealSummary } from './linkable-appeals.formatter.js';
import { formatHorizonGetCaseData } from '#utils//mapping/map-horizon.js';

/**
 * @typedef {object} LinkableAppealSummary
 * @property {string |undefined} appealId
 * @property {string | undefined} appealReference
 * @property {string | undefined} appealType
 * @property {string} appealStatus
 * @property {{siteAddressLine1: string | undefined | null, siteAddressLine2: string | undefined | null, siteAddressTown: string | undefined | null, siteAddressCounty: string | undefined | null, siteAddressPostcode: string | undefined | null}} siteAddress
 * @property {string} localPlanningDepartment
 * @property {string | undefined} appellantName
 * @property {string | undefined | null} [agentName]
 * @property {string} submissionDate
 * @property {'horizon' | 'back-office'} source
 */

/**
 *
 * @param {string} appealReference
 * @returns {Promise<LinkableAppealSummary>}
 */
export const getLinkableAppealSummaryByCaseReference = async (appealReference) => {
	let appeal = await appealRepository.getAppealByAppealReference(appealReference);
	if (!appeal) {
		const horizonAppeal = await getAppealFromHorizon(appealReference).catch((error) => {
			throw error;
		});
		return formatHorizonGetCaseData(horizonAppeal);
	} else {
		return formatLinkableAppealSummary(appeal);
	}
};
