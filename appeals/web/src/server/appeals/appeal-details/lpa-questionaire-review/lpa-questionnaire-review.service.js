import { get, patch } from '../../../lib/request.js';
/** @typedef {import('../appeal-details.types').SingleLPAQuestionnaireResponse} LpaQuestionnaire */

/**
 * @param {string} appealId
 * @param {string} lpaQuestionnaireId
 * @returns {Promise<LpaQuestionnaire>}
 */
export function getLpaQuestionnaireFromId(appealId, lpaQuestionnaireId) {
	return get(`appeals/${appealId}/lpa-questionnaires/${lpaQuestionnaireId}`);
}

/**
 * @param {string} appealId
 * @param {string} lpaQuestionnaireId
 * @param {string} reviewOutcome
 * @returns {Promise<LpaQuestionnaire>}
 */
export function setReviewOutcomeForLpaQuestionnaire(appealId, lpaQuestionnaireId, reviewOutcome) {
	// TODO: when BOAT-238 is complete - update based on API schema
	return patch(`appeals/${appealId}/lpa-questionnaires/${lpaQuestionnaireId}`, {
		json: {
			reviewOutcome
		}
	});
}
