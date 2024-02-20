import appealRepository from '#repositories/appeal.repository.js';
import { getAppealFromHorizon } from '#utils/horizon-gateway.js';
import { formatLinkableAppealSummary } from './linkable-appeal.formatter.js';
import { formatHorizonGetCaseData } from '#utils//mapping/map-horizon.js';

/**
 *
 * @param {string} appealReference
 * @returns {Promise<import('@pins/appeals.api').Appeals.LinkableAppealSummary>}
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
