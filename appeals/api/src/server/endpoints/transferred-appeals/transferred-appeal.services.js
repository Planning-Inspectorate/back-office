import { getAppealFromHorizon } from '#utils/horizon-gateway.js';

/**
 *
 * @param {string} appealReference
 * @returns {Promise<{caseFound: boolean}>}
 */
export const getTransferredAppealStatusByCaseReference = async (appealReference) => {
	return (await getAppealFromHorizon(appealReference).catch((error) => {
		throw error;
	}))
		? { caseFound: true }
		: { caseFound: false };
};
