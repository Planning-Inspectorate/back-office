/** @typedef {import('@pins/validation').AppealOutcomeStatus} AppealOutcomeStatus */

/**
 * Representation of the review outcome that captures the initial choice of the user.
 *
 * @typedef {Object} InitialReviewOutcomeState
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {AppealOutcomeStatus=} status - Any initial outcome chosen by the user.
 */

/**
 * @typedef {import('./validation.service').OutcomeData & { appealId: number }} ReviewOutcomeState
 */

/**
 * @typedef {Object} ValidationState
 * @property {(InitialReviewOutcomeState | ReviewOutcomeState)=} reviewOutcome - The state representing data from the review outcome journey.
 */

/**
 * @typedef {import('express-session').Session & { validation?: ValidationState }} SessionWithInspector
 */

/**
 * Get the validation state from the session.
 *
 * @param {SessionWithInspector} session – The session containing a validation state.
 * @returns {ValidationState} - The validation state from the session.
 */
const getValidationState = (session) => session.validation || {};

/**
 * Get any review outcome recorded by the user for this appeal.
 *
 * @param {SessionWithInspector} session – The session containing a validation state.
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {(InitialReviewOutcomeState | ReviewOutcomeState)=} - The review outcome previously entered by the user.
 */
const getReviewOutcomeState = (session, appealId) => {
	const { reviewOutcome } = getValidationState(session);
	// If the appealId in the session differs, ignore the existing state,
	// otherwise we strip the appealId as it's an internal property only and not
	// part of the review outcome.
	return reviewOutcome?.appealId === appealId ? reviewOutcome : undefined;
};

/**
 * Clear the validation state from the session.
 *
 * @param {SessionWithInspector} session – The session containing an validation state.
 * @returns {void}
 */
export const destroyReviewOutcome = (session) => {
	delete session.validation?.reviewOutcome;
};

/**
 * Get the review outcome status recorded by the user for this appeal.
 *
 * @param {SessionWithInspector} session – The session containing a validation state.
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {AppealOutcomeStatus=} - The review outcome status chosen by the user.
 */
export const getReviewOutcomeStatus = (session, appealId) => {
	const reviewOutcome = getReviewOutcomeState(session, appealId);

	return reviewOutcome?.status;
};

/**
 * Get the review outcome recorded by the user for this appeal, regardless of its status.
 *
 * @param {SessionWithInspector} session – The session containing a validation state.
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {ReviewOutcomeState=} - The outcome details recorded by the user.
 */
export const getReviewOutcome = (session, appealId) => {
	const state = getReviewOutcomeState(session, appealId);

	return /** @type {ReviewOutcomeState} */ (state);
};

/**
 * Store the completed outcome from reviewing an appeal.
 *
 * @param {SessionWithInspector} session – The session containing a validation state.
 * @param {ReviewOutcomeState} data – The completed review outcome entered by the user.
 * @returns {void}
 */
export const setReviewOutcome = (session, data) => {
	const state = getValidationState(session);
	state.reviewOutcome = data;
	session.validation = state;
};

/**
 * Store the outcome status from reviewing an appeal.
 *
 * @param {SessionWithInspector} session – The session containing a validation state.
 * @param {InitialReviewOutcomeState} data – The initial review outcome chosen by the user.
 * @returns {void}
 */
export const setReviewOutcomeStatus = (session, data) => {
	const state = getValidationState(session);
	state.reviewOutcome = data;
	session.validation = state;
};
