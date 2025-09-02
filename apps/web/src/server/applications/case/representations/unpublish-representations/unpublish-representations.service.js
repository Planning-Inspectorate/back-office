import { patch } from '../../../../lib/request.js';

/**
 * Unpublishes a batch of representations for a given case.
 * @param {string} caseId
 * @param {string[]} representationIds
 * @returns {Promise<any>}
 */
export const unpublishRepresentationsBatch = async (caseId, representationIds) => {
	return patch(`applications/${caseId}/representations/unpublish`, {
		json: { representationIds }
	});
};
