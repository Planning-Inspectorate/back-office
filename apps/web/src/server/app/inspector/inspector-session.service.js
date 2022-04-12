import fs from 'fs';

/** @typedef {import('@pins/inspector').AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/inspector').SiteVisitType} SiteVisitType */

/**
 * @typedef {Object} SiteVisitState
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {string} siteVisitDate - The date of the site visit.
 * @property {string} siteVisitTimeSlot – The time of site visit.
 * @property {SiteVisitType} siteVisitType – The type of site visit.
 */

/**
 * @typedef {Object} DecisionState
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {AppealOutcome} outcome - The outcome of the decision for confirmation.
 * @property {Express.Multer.File} decisionLetter - The uploaded decision letter for confirmation.
 */

/**
 * @typedef {Object} InspectorState
 * @property {number[]} assignedAppealIds - Any appeal ids assigned to the user during the session.
 * @property {SiteVisitState=} siteVisit - The state representing data from the site visit booking form.
 * @property {DecisionState=} decision - The state representing data from the issue decision form.
 */

/**
 * @typedef {import('express-session').Session & { inspector?: InspectorState }} SessionWithInspector
 */

/**
 * Get the `inspector` state from a session.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @returns {InspectorState} - The slice of state belonging to this appeal id.
 */
const getInspectorState = (session) => {
	if (!session.inspector) {
		session.inspector = {
			assignedAppealIds: []
		};
	}
	return session.inspector;
};

/**
 * Add a list of appeal ids to the session. Note this does not replace any
 * existing assigned appeal ids, as they are cumulative until the point where
 * the session expires.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {number[]} appealIds - Unique identifiers for appeals recently assigned to the user.
 * @returns {void}
 */
export const addAssignedAppealIds = (session, appealIds) => {
	const state = getInspectorState(session);

	state.assignedAppealIds = [...state.assignedAppealIds, ...appealIds];
};

/**
 * Get the unique identifiers of appeals assigned to the user during this session.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @returns {number[]} - Unique identifiers for appeals recently assigned to the user.
 */
export const getAssignedAppealIds = (session) => {
	const state = getInspectorState(session);

	return state.assignedAppealIds;
};

/**
 * Delete the `siteVisit` slice of state from the session.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @returns {void}
 */
export const destroySiteVisit = (session) => {
	const state = getInspectorState(session);

	if (state?.siteVisit) {
		delete state.siteVisit;
	}
};

/**
 * Fetch the site visit form data for a given `appealId`.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {SiteVisitState=} - The site visit data.
 */
export const getSiteVisit = (session, appealId) => {
	const state = getInspectorState(session);

	// If the request appealId is not in the session, clean up any residual site visit
	if (state.siteVisit?.appealId !== appealId) {
		destroySiteVisit(session);
	}
	return state.siteVisit;
};

/**
 * Store the site visit data from the create booking form for a given appeal.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {SiteVisitState & { appealId: number }} siteVisit – The data for creating the site visit booking.
 * @returns {void}
 */
export const setSiteVisit = (session, siteVisit) => {
	const state = getInspectorState(session);

	session.inspector = { ...state, siteVisit };
};

/**
 * Delete the `decision` slice of state from the session and clean up any associated files.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @returns {void}
 */
export const destroyDecision = (session) => {
	const state = getInspectorState(session);

	if (state?.decision) {
		fs.unlinkSync(state.decision.decisionLetter.path);
		delete state.decision;
	}
};

/**
 * Fetch the decision form data for a given `appealId`.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {DecisionState=} - The site visit data.
 */
export const getDecision = (session, appealId) => {
	const state = getInspectorState(session);

	// If the request appealId is not in the session, clean up any residual decision
	if (state.decision?.appealId !== appealId) {
		destroyDecision(session);
	}
	return state.decision;
};

/**
 * Store the decision data from the 'Issue decision' form for a given appeal.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {DecisionState & { appealId: number }} decision – The data for issuing a decision.
 * @returns {void}
 */
export const setDecision = (session, decision) => {
	const state = getInspectorState(session);

	session.inspector = { ...state, decision };
};
