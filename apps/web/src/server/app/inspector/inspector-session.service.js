// @ts-check

import fs from 'fs';

/** @typedef {import('@pins/inspector').AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/inspector').SiteVisitType} SiteVisitType */

/**
 * @typedef {Object} SiteVisitState
 * @property {string} siteVisitDate - The date of the site visit.
 * @property {string} siteVisitTimeSlot – The time of site visit.
 * @property {SiteVisitType} siteVisitType – The type of site visit.
 */

/**
 * @typedef {Object} DecisionState
 * @property {AppealOutcome} outcome - The outcome of the decision for confirmation.
 * @property {Express.Multer.File} decisionLetter - The uploaded decision letter for confirmation.
 */

/**
 * @typedef {Object} InspectorState
 * @property {number} appealId - Unique identifier for the appeal.
 * @property {SiteVisitState=} siteVisit - The state representing data from the site visit booking form.
 * @property {DecisionState=} decision - The state representing data from the issue decision form.
 */

/**
 * @typedef {import('express-session').Session & { inspector?: InspectorState }} SessionWithInspector
 */

/**
 * Reset the inspector state in the session.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @returns {void}
 */
export const destroy = (session) => {
	// When clearing the session, clean up any temporary file associated with a decision
	if (session.inspector?.decision) {
		fs.unlinkSync(session.inspector.decision.decisionLetter.path);
	}
	delete session.inspector;
};

/**
 * Get the `inspector` state belonging to an `appealId`. If the state in the
 * session differs from the `appealId` then we ignore it as redundant.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {InspectorState} - The slice of state belonging to this appeal id.
 */
const getInspectorState = (session, appealId) => {
	if (session.inspector && session.inspector.appealId === appealId) {
		return session.inspector;
	}
	// Clean up any redundant session if we have changed appealId
	destroy(session);

	return { appealId };
};

/**
 * Fetch the decision form data for a given `appealId`.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {DecisionState=} - The site visit data.
 */
export const getDecision = (session, appealId) => {
	const { decision } = getInspectorState(session, appealId);

	return decision;
};

/**
 * Fetch the site visit form data for a given `appealId`.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {SiteVisitState=} - The site visit data.
 */
export const getSiteVisit = (session, appealId) => {
	const { siteVisit } = getInspectorState(session, appealId);

	return siteVisit;
};

/**
 * Store the decision data from the 'Issue decision' form for a given appeal.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {DecisionState & { appealId: number }} data – The data for issuing a decision.
 * @returns {void}
 */
export const setDecision = (session, { appealId, ...decision }) => {
	const state = getInspectorState(session, appealId);

	session.inspector = { ...state, decision };
};

/**
 * Store the site visit data from the create booking form for a given appeal.
 *
 * @param {SessionWithInspector} session – The session containing an inspector state.
 * @param {SiteVisitState & { appealId: number }} data – The data for creating the site visit booking.
 * @returns {void}
 */
export const setSiteVisit = (session, { appealId, ...siteVisit }) => {
	const state = getInspectorState(session, appealId);

	session.inspector = { ...state, siteVisit };
};
