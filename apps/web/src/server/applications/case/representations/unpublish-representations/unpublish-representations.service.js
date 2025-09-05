import { patch } from '../../../../lib/request.js';

/**
 * Unpublishes a batch of representations for a given case.
 * @param {string} caseId
 * @param {string[]} representationIds
 * @param {string} actionBy
 * @returns {Promise<any>}
 */
export const unpublishRepresentationsBatch = async (caseId, representationIds, actionBy) => {
	try {
		console.log('[unpublishRepresentationsBatch] PATCH request:', {
			caseId,
			representationIds,
			actionBy
		});
		const response = await patch(`applications/${caseId}/representations/unpublish`, {
			json: { representationIds, actionBy }
		});
		console.log('[unpublishRepresentationsBatch] PATCH response:', response);
		return response;
	} catch (error) {
		console.error('[unpublishRepresentationsBatch] PATCH error:', error);
		throw error;
	}
};
