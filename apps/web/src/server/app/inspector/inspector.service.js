import { get, post } from './../../lib/request.js';

/** @typedef {import('@pins/inspector').Appeal} Appeal */
/** @typedef {import('@pins/inspector').AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/inspector').AppealSummary} AppealSummary */
/** @typedef {import('@pins/inspector').SiteVisitType} siteVisitType */

/**
 * Assign unassigned appeals to the user.
 *
 * @param {number[]} appealIds - An array of appeal ids
 * @returns {Promise<AppealSummary[]>} - A promise that resolves to the appeals now assigned to the user.
 */
export function assignAppealsToUser(appealIds) {
	return post('inspector/assign', { json: appealIds });
}

/**
 * @typedef {Object} BookSiteVisitData
 * @property {string} siteVisitDate - The date of the site visit.
 * @property {string} siteVisitTimeSlot – The time of site visit.
 * @property {siteVisitType} siteVisitType – The type of site visit.
 */

/**
 * Create a site visit booking for an appeal.
 *
 * @param {number} appealId - Unique identifier for the appeal.
 * @param {BookSiteVisitData} data – The data for creating the site visit booking.
 * @returns {Promise<Appeal>} - A promise that resolves to the updated appeal.
 */
export function bookSiteVisit(appealId, data) {
	return post(`inspector/${appealId}/book`, { json: data });
}

/**
 * Fetch a list of appeals that are assigned to the user.
 *
 * @returns {Promise<AppealSummary[]>} - A promise that resolves to a collection of appeal entities.
 */
export function findAllAssignedAppeals() {
	return get('inspector');
}

/**
 * Fetch a list of appeals that are not yet assigned to an inspector.
 *
 * @returns {Promise<AppealSummary[]>} - A promise that resolves to a collection of appeal entities.
 */
export function findAllUnassignedAppeals() {
	return get('inspector/unassigned');
}

/**
 * Fetch an appeal for the inspector journey.
 *
 * This call implements a 1s caching window such that multiple middleware
 * functions can fetch the appeal during the lifecycle of handling a route
 * and an api call will occur only once.
 *
 * @param {number} appealId - Unique identifier for the appeal.
 * @returns {Promise<Appeal>} - A promise that resolves to the appeal entity.
 */
export function findAppealById(appealId) {
	return get(`inspector/${appealId}`, { context: { ttl: 1000 } });
}

/**
 * @typedef {Object} IssueDecisionData
 * @property {AppealOutcome} outcome - The outcome of the decision.
 * @property {Express.Multer.File} decisionLetter - The uploaded decision letter as a multer file.
 */

/**
 * Issue a decision for an appeal.
 *
 * @param {number} appealId - Unique identifier for the appeal.
 * @param {IssueDecisionData} data – The data for creating the appeal decision.
 * @returns {Promise<Appeal>} - A promise that resolves to the updated appeal.
 */
export function issueDecision(appealId, { outcome }) {
	// This endpoint currently won't accept files
	// https://pins-ds.atlassian.net/browse/BOCM-301
	return post(`inspector/${appealId}`, { json: { outcome } });
}
