import { isEmpty } from 'lodash-es';
import * as inspector from './inspector.service.js';
import appealRepository from '../repositories/appeal.repository.js';
import { appealStates } from '../state-machine/transition-state.js';
import InspectorError from './inspector-error.js';
import { appealFormatter } from './appeal-formatter.js';
import { formatAppeal } from '../utils/appeal-formatter.js';

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
		appealStates.decision_due,
		'picked_up'
	], userId);
	const appealsForResponse = appeals.map((appeal) => appealFormatter.formatAppealForAllAppeals(appeal));
	return response.send(appealsForResponse);
};

const getAppealDetails = async function(request, response) {
	const appeal = await appealRepository.getById(request.params.appealId, {
		appellant: true,
		validationDecision: true,
		address: true,
		latestLPAReviewQuestionnaire: true,
		appealDetailsFromAppellant: true,
		lpaQuestionnaire: true
	});
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

const getMoreAppeals = async function(request, response) {
	const moreAppeals = await appealRepository.getByStatuses(
		[appealStates.available_for_inspector_pickup],
		true,
		false,
		true,
		true
	);
	const moreAppealsFormatted = moreAppeals.map((appeal) => appealFormatter.formatAppealForMoreAppeals(appeal));
	return response.send(moreAppealsFormatted);
 };

/**
 * @typedef {object} BookSiteVisitRequestBody
 * @property {Date} siteVisitDate
 * @property {string} siteVisitTimeSlot
 * @property {SiteVisitType} siteVisitType
 */

/**
 * @typedef {object} AppealParams
 * @property {number} appealId
 */

/**
 * Create a site visit booking for an appeal and serve the updated appeal in response.
 *
 * @type {import('express').RequestHandler<AppealParams, Appeal, BookSiteVisitRequestBody>}
 */
export const bookSiteVisit = async ({ body, params }, response) => {
	await inspector.bookSiteVisit({
		appealId: params.appealId,
		siteVisit: {
			visitDate: body.siteVisitDate,
			visitSlot: body.siteVisitTimeSlot,
			visitType: body.siteVisitType
		}
	});

	const updatedAppeal = await appealRepository.getByIdIncluding(params.appealId, { siteVisit: true });

	response.send(formatAppeal(updatedAppeal));
};

/**
 * @typedef {object} IssueDecisionRequestBody
 * @property {AppealOutcome} outcome
 */

/**
 * Issue a decision for an appeal and serve the updated appeal in response.
 *
 * @type {import('express').RequestHandler<AppealParams, Appeal, IssueDecisionRequestBody>}
 */
export const issueDecision = async ({ body, file, params }, response) => {
	await inspector.issueDecision({
		appealId: params.appealId,
		outcome: body.outcome,
		decisionLetter: file
	});

	const updatedAppeal = await appealRepository.getByIdIncluding(params.appealId, { inspectorDecision: true });

	response.send(formatAppeal(updatedAppeal));
};

export { getAppeals, assignAppeals, getAppealDetails, getMoreAppeals };
