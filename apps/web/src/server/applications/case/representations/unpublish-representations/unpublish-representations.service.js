import { get, patch } from '../../../../lib/request.js';

/**
 * Gets all unpublishable representations for a given case (no pagination).
 * @param {string} caseId
 * @returns {Promise<any>}
 */
export const getUnpublishableRepresentations = async (caseId) =>
	get(`applications/${caseId}/representations/unpublish`);

/**
 * Unpublishes a batch of representations for a given case.
 * @param {string} caseId
 * @param {string} actionBy
 * @returns {Promise<any>}
 */
export const unpublishRepresentations = async (caseId, actionBy) => {
	try {
		return await patch(`applications/${caseId}/representations/unpublish`, {
			json: { actionBy }
		});
	} catch (error) {
		throw new Error(`[unpublishRepresentationsBatch]: ${error} `);
	}
};
