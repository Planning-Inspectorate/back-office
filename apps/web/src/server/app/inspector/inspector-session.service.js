import fs from 'fs';

/** @typedef {import('@pins/appeals').Inspector.AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/appeals').Inspector.SiteVisitType} SiteVisitType */

/**
 * @typedef {import('express-session').Session & { inspector?: InspectorState }} SessionWithInspector
 */

/**
 * @typedef {Object} InspectorState
 * @property {number[]} assignedAppealIds
 * @property {SiteVisitState=} siteVisit
 * @property {DecisionState=} decision
 */

/**
 * @typedef {Object} DecisionState
 * @property {number} appealId
 * @property {AppealOutcome} outcome
 * @property {Express.Multer.File} decisionLetter
 */

/**
 * @typedef {Object} SiteVisitState
 * @property {number} appealId
 * @property {string} siteVisitDate
 * @property {string} siteVisitTimeSlot
 * @property {SiteVisitType} siteVisitType
 */

/**
 * Get the `inspector` state from a session.
 *
 * @param {SessionWithInspector} session
 * @returns {InspectorState}
 */
const getState = (session) => {
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
 * @param {SessionWithInspector} session
 * @param {number[]} appealIds
 * @returns {void}
 */
export const addAssignedAppealIds = (session, appealIds) => {
	const state = getState(session);

	state.assignedAppealIds = [...state.assignedAppealIds, ...appealIds];
};

/**
 * Get the unique identifiers of appeals assigned to the user during this session.
 *
 * @param {SessionWithInspector} session
 * @returns {number[]}
 */
export const getAssignedAppealIds = (session) => {
	const state = getState(session);

	return state.assignedAppealIds;
};

/**
 * Delete the `siteVisit` slice of state from the session.
 *
 * @param {SessionWithInspector} session
 * @returns {void}
 */
export const destroySiteVisit = (session) => {
	const state = getState(session);

	if (state?.siteVisit) {
		delete state.siteVisit;
	}
};

/**
 * Fetch the site visit form data for a given `appealId`.
 *
 * @param {SessionWithInspector} session
 * @param {number} appealId
 * @returns {SiteVisitState=}
 */
export const getSiteVisit = (session, appealId) => {
	const state = getState(session);

	// If the request appealId is not in the session, clean up any residual site visit
	if (state.siteVisit?.appealId !== appealId) {
		destroySiteVisit(session);
	}
	return state.siteVisit;
};

/**
 * Store the site visit data from the create booking form for a given appeal.
 *
 * @param {SessionWithInspector} session
 * @param {SiteVisitState & { appealId: number }} siteVisit
 * @returns {void}
 */
export const setSiteVisit = (session, siteVisit) => {
	const state = getState(session);

	session.inspector = { ...state, siteVisit };
};

/**
 * Delete the `decision` slice of state from the session and clean up any associated files.
 *
 * @param {SessionWithInspector} session
 * @returns {void}
 */
export const destroyDecision = (session) => {
	const state = getState(session);

	if (state?.decision) {
		fs.unlinkSync(state.decision.decisionLetter.path);
		delete state.decision;
	}
};

/**
 * Fetch the decision form data for a given `appealId`.
 *
 * @param {SessionWithInspector} session
 * @param {number} appealId
 * @returns {DecisionState=}
 */
export const getDecision = (session, appealId) => {
	const state = getState(session);

	// If the request appealId is not in the session, clean up any residual decision
	if (state.decision?.appealId !== appealId) {
		destroyDecision(session);
	}
	return state.decision;
};

/**
 * Store the decision data from the 'Issue decision' form for a given appeal.
 *
 * @param {SessionWithInspector} session
 * @param {DecisionState & { appealId: number }} decision
 * @returns {void}
 */
export const setDecision = (session, decision) => {
	const state = getState(session);

	session.inspector = { ...state, decision };
};
