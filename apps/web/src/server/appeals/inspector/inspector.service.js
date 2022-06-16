import { appendFilesToFormData } from '@pins/express';
import FormData from 'form-data';
import { get, post } from '../../lib/request.js';

/** @typedef {import('@pins/appeals').Inspector.Appeal} Appeal */
/** @typedef {import('@pins/appeals').Inspector.AppealSummary} AppealSummary */

/**
 * Assign unassigned appeals to the user.
 *
 * @param {number[]} appealIds
 * @returns {Promise<{ successfullyAssigned: AppealSummary[]; unsuccessfullyAssigned: AppealSummary[] }>}
 */
export function assignAppealsToUser(appealIds) {
	return post('appeals/inspector/assign', { json: appealIds });
}

/**
 * @typedef {object} BookSiteVisitData
 * @property {string} siteVisitDate
 * @property {string} siteVisitTimeSlot
 * @property {import('@pins/appeals').Inspector.SiteVisitType} siteVisitType
 */

/**
 * Create a site visit booking for an appeal.
 *
 * @param {number} appealId
 * @param {BookSiteVisitData} data
 * @returns {Promise<Appeal>}
 */
export async function bookSiteVisit(appealId, data) {
	return post(`appeals/inspector/${appealId}/book`, { json: data });
}

/**
 * Fetch a list of appeals that are assigned to the user.
 *
 * @returns {Promise<AppealSummary[]>}
 */
export function findAllAssignedAppeals() {
	return get('appeals/inspector');
}

/**
 * Fetch a list of appeals that are not yet assigned to an inspector.
 *
 * @returns {Promise<AppealSummary[]>}
 */
export function findAllUnassignedAppeals() {
	return get('appeals/inspector/more-appeals');
}

/**
 * Fetch an appeal for the inspector journey.
 *
 * This call implements a 1s caching window such that multiple middleware
 * functions can fetch the appeal during the lifecycle of handling a route
 * and an api call will occur only once.
 *
 * @param {string | number} appealId
 * @returns {Promise<Appeal>}
 */
export function findAppealById(appealId) {
	return get(`appeals/inspector/${appealId}`);
}

/**
 * @typedef {object} IssueDecisionData
 * @property {import('@pins/appeals').Inspector.AppealOutcome} outcome
 * @property {import('@pins/express').MulterFile} decisionLetter
 */

/**
 * Issue a decision for an appeal.
 *
 * @param {number} appealId
 * @param {IssueDecisionData} data
 * @returns {Promise<Appeal>}
 */
export function issueDecision(appealId, { outcome, decisionLetter }) {
	const formData = new FormData();

	formData.append('outcome', outcome);
	appendFilesToFormData(formData, { key: 'decisionLetter', file: decisionLetter });
	// This endpoint currently won't save files
	// https://pins-ds.atlassian.net/browse/BOCM-301
	return post(`appeals/inspector/${appealId}/issue-decision`, {
		body: formData,
		headers: formData.getHeaders()
	});
}
