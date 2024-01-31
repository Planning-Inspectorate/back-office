import appealRepository from '#repositories/appeal.repository.js';
import { getAppealFromHorizon } from '#utils/horizon-gateway.js';
import { formattedLinkableAppealSummary } from './linkable-appeals.formatter.js';

/**
 *
 * @param {string} appealReference
 * @returns {Promise<import("#utils/horizon-gateway.js").LinkableAppealSummary | unknown>}
 */
export const getLinkableAppealSummaryByCaseReference = async (appealReference) => {
	let appeal = await appealRepository.getAppealByAppealReference(appealReference);
	if (!appeal) {
		return await getAppealFromHorizon(appealReference).catch((error) => {
			console.log(`Here the error is: ${error}`);
			throw error;
		});
	} else {
		return formattedLinkableAppealSummary(appeal);
	}
};
