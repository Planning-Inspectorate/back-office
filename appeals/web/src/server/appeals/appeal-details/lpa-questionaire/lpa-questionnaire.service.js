/**
 * @typedef {import('../appeal-details.types.js').SingleLPAQuestionnaireResponse} LpaQuestionnaire
 * @typedef {import('@pins/appeals.api').Schema.LPAQuestionnaireIncompleteReason} LPAQuestionnaireIncompleteReason
 */

/**
 * @typedef {Object} DayMonthYear
 * @property {number} day
 * @property {number} month
 * @property {number} year
 */

/**
 * @typedef {Object} LpaQuestionnaireReviewOutcome
 * @property {string} validationOutcome
 * @property {number[]} [incompleteReasons]
 * @property {string} [otherReasons] - free text field for "other"
 * @property {string} [appealDueDate]
 */

/**
 * @param {string} appealId
 * @param {string} lpaQuestionnaireId
 * @param {import('got').Got} apiClient
 * @returns {Promise<LpaQuestionnaire>}
 */
export function getLpaQuestionnaireFromId(apiClient, appealId, lpaQuestionnaireId) {
	return apiClient.get(`appeals/${appealId}/lpa-questionnaires/${lpaQuestionnaireId}`).json();
}

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} lpaQuestionnaireId
 * @param {LpaQuestionnaireReviewOutcome} reviewOutcome
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
			json: { ...reviewOutcome }
		})
		.json();
}

/**
 *
 * @param {import('got').Got} apiClient
 * @returns {Promise<LPAQuestionnaireIncompleteReason[]>}
 */
export async function getLPAQuestionnaireIncompleteReasons(apiClient) {
	return apiClient.get(`appeals/lpa-questionnaire-incomplete-reasons`).json();
}
