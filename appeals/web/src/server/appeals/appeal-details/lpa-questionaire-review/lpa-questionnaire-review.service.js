/** @typedef {import('../appeal-details.types').SingleLPAQuestionnaireResponse} LpaQuestionnaire */

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} lpaQuestionnaireId
 * @returns {Promise<LpaQuestionnaire>}
 */
export function getLpaQuestionnaireFromId(apiClient, appealId, lpaQuestionnaireId) {
	return apiClient.get(`appeals/${appealId}/lpa-questionnaires/${lpaQuestionnaireId}`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} lpaQuestionnaireId
 * @param {string} reviewOutcome
 * @returns {Promise<LpaQuestionnaire>}
 */
export function setReviewOutcomeForLpaQuestionnaire(
	apiClient,
	appealId,
	lpaQuestionnaireId,
	reviewOutcome
) {
	return apiClient
		.patch(`appeals/${appealId}/lpa-questionnaires/${lpaQuestionnaireId}`, {
			json: {
				validationOutcome: reviewOutcome
			}
		})
		.json();
}
