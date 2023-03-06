/** @typedef {import('@pins/appeals').Validation.AppealOutcomeStatus} AppealOutcomeStatus */

/**
 * @typedef {import('express-session').Session & { validation?: ValidationState }} SessionWithInspector
 */

/**
 * @typedef {object} ValidationState
 * @property {(InitialReviewOutcomeState | ReviewOutcomeState)=} reviewOutcome
 */

/**
 * @typedef {object} InitialReviewOutcomeState
 * @property {number} appealId
 * @property {AppealOutcomeStatus=} status
 */

/**
 * @typedef {import('./validation.service').OutcomeData & { appealId: number }} ReviewOutcomeState
 */

/**
 * Get the validation state from the session.
 *
 * @param {SessionWithInspector} session
 * @returns {ValidationState}
 */
const getState = (session) => session.validation || {};

/**
 * Get any review outcome recorded by the user for this appeal.
 *
 * @param {SessionWithInspector} session
 * @param {number} appealId
 * @returns {(InitialReviewOutcomeState | ReviewOutcomeState)|void}
 */
const getReviewOutcomeState = (session, appealId) => {
	const { reviewOutcome } = getState(session);

	// If the appealId in the session differs, ignore the existing state,
	// otherwise we strip the appealId as it's an internal property only and not
	// part of the review outcome.
	if (reviewOutcome?.appealId === appealId) {
		return reviewOutcome;
	}
};

/**
 * Clear the validation state from the session.
 *
 * @param {SessionWithInspector} session
 * @returns {void}
 */
export const destroyReviewOutcome = (session) => {
	delete session.validation?.reviewOutcome;
};

/**
 * Get the review outcome status recorded by the user for this appeal.
 *
 * @param {SessionWithInspector} session
 * @param {number} appealId
 * @returns {AppealOutcomeStatus=}
 */
export const getReviewOutcomeStatus = (session, appealId) => {
	const reviewOutcome = getReviewOutcomeState(session, appealId);

	return reviewOutcome?.status;
};

/**
 * Get the review outcome recorded by the user for this appeal, regardless of its status.
 *
 * @param {SessionWithInspector} session
 * @param {number} appealId
 * @returns {ReviewOutcomeState=}
 */
export const getReviewOutcome = (session, appealId) => {
	const state = getReviewOutcomeState(session, appealId);

	return /** @type {ReviewOutcomeState} */ (state);
};

/**
 * Store the completed outcome from reviewing an appeal.
 *
 * @param {SessionWithInspector} session
 * @param {ReviewOutcomeState} data
 * @returns {void}
 */
export const setReviewOutcome = (session, data) => {
	const state = getState(session);

	state.reviewOutcome = data;
	session.validation = state;
};

/**
 * Store the outcome status from reviewing an appeal.
 *
 * @param {SessionWithInspector} session
 * @param {InitialReviewOutcomeState} data
 * @returns {void}
 */
export const setReviewOutcomeStatus = (session, data) => {
	const state = getState(session);
	const isUnchanged =
		state.reviewOutcome?.appealId === data.appealId && state.reviewOutcome?.status === data.status;

	// if we are setting an unchanged review outcome status for the same appealId
	// then do nothing
	if (!isUnchanged) {
		state.reviewOutcome = data;
		session.validation = state;
	}
};
