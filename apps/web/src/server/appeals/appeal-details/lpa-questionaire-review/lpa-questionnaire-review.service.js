import { get } from '../../../lib/request.js';
/** @typedef {import('../appeal-details.types').SingleLPAQuestionnaireResponse} LpaQuestionnaire */

/**
 * @param {string} appealId
 * @param {string} lpaQuestionnaireId
 * @returns {Promise<LpaQuestionnaire>}
 */
export function getLpaQuestionnaireFromId(appealId, lpaQuestionnaireId) {
	return get(`appeals/${appealId}/lpa-questionnaires/${lpaQuestionnaireId}`);
}
