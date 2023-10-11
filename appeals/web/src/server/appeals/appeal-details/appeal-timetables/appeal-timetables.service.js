/**
 * @typedef {Object} AppealTimetables
 * @property {string?} [finalCommentReviewDate]
 * @property {string?} [issueDeterminationDate]
 * @property {string?} [lpaQuestionnaireDueDate]
 * @property {string?} [statementReviewDate]
 * @property {object | string | undefined} [errors]
 */

/**
 * @param {import('got').Got} apiClient
 * @param {string} appealId
 * @param {string} appealTimetableId
 * @param {AppealTimetables} appealTimetables
 * @returns {Promise<AppealTimetables>}
 */
export function setAppealTimetables(apiClient, appealId, appealTimetableId, appealTimetables) {
	return apiClient
		.patch(`appeals/${appealId}/appeal-timetables/${appealTimetableId}`, { json: appealTimetables })
		.json()
		.catch((error) => error?.response?.body || error);
}
