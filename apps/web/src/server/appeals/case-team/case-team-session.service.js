/** @typedef {import('@pins/appeals').CaseTeam.Questionnaire} CaseTeamQuestionnaire */

/**
 * @typedef {import('express-session').Session & { CaseTeam?: CaseTeamState }} SessionWithCaseTeam
 */

/**
 * @typedef {object} CaseTeamState
 * @property {QuestionnaireReviewState=} questionnaireReview
 */

/**
 * @typedef {object} QuestionnaireReviewState
 * @property {number} appealId
 * @property {CaseTeamQuestionnaire} reviewQuestionnaire
 */

/**
 * Get the case-team state from the session.
 *
 * @param {SessionWithCaseTeam} session
 * @returns {CaseTeamState}
 */
const getState = (session) => session.CaseTeam || {};

/**
 * @param {SessionWithCaseTeam} session
 * @returns {void}
 */
export const destroyQuestionnaireReview = (session) => {
	delete session.CaseTeam?.questionnaireReview;
};

/**
 * Set the reviewed questionnaire data after completing a review.
 *
 * @param {SessionWithCaseTeam} session
 * @param {QuestionnaireReviewState} questionnaireReview
 * @returns {void}
 */
export const setQuestionnaireReview = (session, questionnaireReview) => {
	const state = getState(session);

	session.CaseTeam = { ...state, questionnaireReview };
};

/**
 * Get the reviewed questionnaire data belonging to a completed review.
 *
 * @param {SessionWithCaseTeam} session
 * @param {number} appealId
 * @returns {QuestionnaireReviewState | null}
 */
export const getQuestionnaireReview = (session, appealId) => {
	const { questionnaireReview } = getState(session);

	if (questionnaireReview?.appealId !== appealId) {
		destroyQuestionnaireReview(session);
	}
	return questionnaireReview?.appealId === appealId ? questionnaireReview : null;
};
