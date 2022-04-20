import { isEmpty } from 'lodash-es';
import * as inspector from './inspector.service.js';
import appealRepository from '../repositories/appeal.repository.js';
import { appealStates } from '../state-machine/transition-state.js';
import InspectorError from './inspector-error.js';
import { appealFormatter } from './appeal-formatter.js';

const validateUserId = function(userid) {
	if (userid == undefined) {
		throw new InspectorError('Must provide userid', 400);
	}
	return Number.parseInt(userid, 10);
};

const getAppeals = async function(request, response) {
	const userId = validateUserId(request.headers.userid);
	const appeals = await appealRepository.getByStatusesAndUserId([
		appealStates.site_visit_not_yet_booked,
		appealStates.site_visit_booked,
		appealStates.decision_due
	], userId);
	const appealsForResponse = appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal));
	return response.send(appealsForResponse);
};

const getAppealDetails = async function(request, response) {
	const appeal = await appealRepository.getById(request.params.appealId, true, true, true, false, true, true, true);
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);
	response.send(formattedAppeal);
};

const validateAppealIdsPresent = function(body) {
	if (isEmpty(body)) {
		throw new InspectorError('Must provide appeals to assign', 400);
	}
};

const assignAppeals = async function(request, response) {
	const userId = request.get('userId');
	validateAppealIdsPresent(request.body);
	const resultantAppeals = await inspector.assignAppealsById(userId, request.body);
	response.send(resultantAppeals);
};

/**
 * @typedef {object} BookSiteVisitRequestBody
 * @property {Date} siteVisitDate - The date of the site visit (as YYYY-MM-DD).
 * @property {string} siteVisitTimeSlot – The time slot of site visit.
 * @property {SiteVisitType} siteVisitType – The type of site visit.
 */

/**
 * @typedef {object} AppealParams
 * @property {number} appealId - Unique identifier for the appeal.
 */

/**
 * Create a site visit booking for an appeal.
 * 
 * @type {import('express').RequestHandler<AppealParams, Appeal, BookSiteVisitRequestBody>}
 */
export const bookSiteVisit = async (request, response) => {
	const { body, params } = request;
	const updatedAppeal = await inspector.bookSiteVisit({
		appealId: params.appealId,
		siteVisit: {
			visitDate: body.siteVisitDate,
			visitSlot: body.siteVisitTimeSlot,
			visitType: body.siteVisitType
		}
	});

	response.send(updatedAppeal);
};

/**
 * @typedef {object} IssueDecisionRequestBody
 * @property {AppealOutcome} outcome – The outcome for the appeal.
 */

/**
 * Issue a decision for an appeal.
 * 
 * @type {import('express').RequestHandler<AppealParams, Appeal, IssueDecisionRequestBody>}
 */
export const issueDecision = async ({ file, body, params }, response) => {
	const updatedAppeal = await inspector.issueDecision({
		appealId: params.appealId,
		outcome: body.outcome,
		decisionLetter: file
	});

	response.send(updatedAppeal);
};

export { getAppeals, assignAppeals, getAppealDetails };
