import { patch } from '../../../../../lib/request.js';

/**
 *
 * @param {string} caseId
 * @param {string} representationId
 * @param {object} body
 * @param {string} body.redactedRepresentation
 * @param {string} body.notes
 * @param {string} body.actionBy
 * @returns {Promise<any>}
 */
export const patchRepresentationRedact = async (
	caseId,
	representationId,
	{ redactedRepresentation, notes, actionBy }
) =>
	await patch(`applications/${caseId}/representations/${representationId}/redact`, {
		json: {
			redactedRepresentation,
			notes,
			actionBy
		}
	});
