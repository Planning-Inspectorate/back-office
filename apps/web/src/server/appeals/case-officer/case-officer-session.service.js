/** @typedef {import('@pins/appeals').CaseOfficer.Questionnaire} CaseOfficerQuestionnaire */

/**
 * @typedef {import('express-session').Session & { caseOfficer?: CaseOfficerState }} SessionWithCaseOfficer
 */

/**
 * @typedef {object} CaseOfficerState
 * @property {QuestionnaireReviewState=} questionnaireReview
 */

/**
 * @typedef {object} QuestionnaireReviewState
 * @property {number} appealId
 * @property {CaseOfficerQuestionnaire} reviewQuestionnaire
 */

/**
 * Get the case-officer state from the session.
 *
 * @param {SessionWithCaseOfficer} session
 * @returns {CaseOfficerState}
 */
const getState = (session) => session.caseOfficer || {};

/**
 * @param {SessionWithCaseOfficer} session
 * @returns {void}
 */
export const destroyQuestionnaireReview = (session) => {
	delete session.caseOfficer?.questionnaireReview;
};

/**
 * Set the reviewed questionnaire data after completing a review.
 *
 * @param {SessionWithCaseOfficer} session
 * @param {QuestionnaireReviewState} questionnaireReview
 * @returns {void}
 */
export const setQuestionnaireReview = (session, questionnaireReview) => {
	const state = getState(session);

	session.caseOfficer = { ...state, questionnaireReview };
};

/**
 * Get the reviewed questionnaire data belonging to a completed review.
 *
 * @param {SessionWithCaseOfficer} session
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
