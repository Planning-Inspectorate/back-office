/** @typedef {import('@pins/appeals').Lpa.Questionnaire} LpaQuestionnaire */

/**
 * @typedef {import('express-session').Session & { lpa?: LpaState }} SessionWithLpa
 */

/**
 * @typedef {object} LpaState
 * @property {QuestionnaireReviewState=} questionnaireReview
 */

/**
 * @typedef {object} QuestionnaireReviewState
 * @property {number} appealId
 * @property {LpaQuestionnaire} reviewQuestionnaire
 */

/**
 * Get the lpa state from the session.
 *
 * @param {SessionWithLpa} session
 * @returns {LpaState}
 */
const getState = (session) => session.lpa || {};

/**
 * @param {SessionWithLpa} session
 * @returns {void}
 */
export const destroyQuestionnaireReview = (session) => {
	delete session.lpa?.questionnaireReview;
};

/**
 * Set the reviewed questionnaire data after completing a review.
 *
 * @param {SessionWithLpa} session
 * @param {QuestionnaireReviewState} questionnaireReview
 * @returns {void}
 */
export const setQuestionnaireReview = (session, questionnaireReview) => {
	const state = getState(session);

	session.lpa = { ...state, questionnaireReview };
};

/**
 * Get the reviewed questionnaire data belonging to a completed review.
 *
 * @param {SessionWithLpa} session
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
