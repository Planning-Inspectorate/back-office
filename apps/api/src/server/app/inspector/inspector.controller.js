import _ from 'lodash';
import * as inspector from './inspector.service.js';
import appealRepository from '../repositories/appeal.repository.js';
import { lpaQuestionnaireStatesStrings } from '../state-machine/lpa-questionnaire-states.js';
import { inspectorStatesStrings } from '../state-machine/inspector-states.js';
import formatAddressLowerCase from '../utils/address-formatter-lowercase.js';
import formatDate from '../utils/date-formatter.js';
import InspectorError from './inspector-error.js';
import transitionState from '../state-machine/household-appeal.machine.js';
import daysBetweenDates from '../utils/days-between-dates.js';

/** @typedef {import('@pins/inspector').Appeal} Appeal */
/** @typedef {import('@pins/inspector').AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/inspector').SiteVisitType} SiteVisitType */

const formatStatus = function(status) {
	switch (status) {
		case inspectorStatesStrings.site_visit_booked:
			return 'booked';
		case inspectorStatesStrings.decision_due:
			return 'decision due';
		case inspectorStatesStrings.site_visit_not_yet_booked:
			return 'not yet booked';
		default:
			throw new Error('Unknown status');
	}
};

const provisionalAppealSiteVisitType = function(appeal) {
	return (!appeal.lpaQuestionnaire.siteVisibleFromPublicLand || !appeal.appealDetailsFromAppellant.siteVisibleFromPublicLand) ?
		'access required' : 'unaccompanied'
}

const formatAppealForAllAppeals = function(appeal) {
	return {
		appealId: appeal.id,
		appealAge: daysBetweenDates(appeal.startedAt, new Date()),
		appealSite: formatAddressLowerCase(appeal.address),
		appealType: 'HAS',
		reference: appeal.reference,
		...(!_.isEmpty(appeal.siteVisit) && { siteVisitDate: formatDate(appeal.siteVisit.visitDate) }),
		...(!_.isEmpty(appeal.siteVisit) && { siteVisitSlot: appeal.siteVisit.visitSlot }),
		...(!_.isEmpty(appeal.siteVisit) && { siteVisitType: appeal.siteVisit.visitType }),
		...(_.isEmpty(appeal.siteVisit) && { provisionalVisitType: provisionalAppealSiteVisitType(appeal) }),
		status: formatStatus(appeal.status),
	};
};

const validateUserId = function(userid) {
	if (userid == undefined) {
		throw new InspectorError('Must provide userid', 400);
	}
	return Number.parseInt(userid, 10);
};

const getAppeals = async function(request, response) {
	const userId = validateUserId(request.headers.userid);
	const appeals = await appealRepository.getByStatusesAndUserId([
		inspectorStatesStrings.site_visit_not_yet_booked,
		inspectorStatesStrings.site_visit_booked,
		inspectorStatesStrings.decision_due
	], userId);
	const appealsForResponse = appeals.map((appeal) => formatAppealForAllAppeals(appeal));
	return response.send(appealsForResponse);
};

const getMoreAppeals = async function(request, response) {
	const moreAppeals = await appealRepository.getByStatusesWithAddresses(
		lpaQuestionnaireStatesStrings.available_for_inspector_pickup
		);
	return response.send(moreAppeals);
};

const formatAppealForAssigningAppeals = function(appeal, reason) {
	return {
		appealId: appeal.id,
		reference: appeal.reference,
		appealType: 'HAS',
		specialist: 'General',
		provisionalVisitType: provisionalAppealSiteVisitType(appeal),
		appealAge: daysBetweenDates(appeal.startedAt, new Date()),
		appealSite: formatAddressLowerCase(appeal.address),
		...(reason != undefined && {reason: reason})
	}
}

const assignAppealsById = async function(userId, appealIds) {
	const successfullyAssigned = [];
	const unsuccessfullyAssigned = [];
	await Promise.all(appealIds.map(async (appealId) => {
		const appeal = await appealRepository.getByIdIncluding(appealId, { address: true, appellant: true, appealDetailsFromAppellant: true });
		if (appeal.userId == undefined && appeal.status == 'available_for_inspector_pickup') {
			try {
				const nextState = transitionState({ appealId: appeal.id }, appeal.status, 'PICKUP');
				await appealRepository.updateById(appeal.id, { status: nextState.value, user: { connect: { id: userId } } });
				successfullyAssigned.push(formatAppealForAssigningAppeals(appeal));
			} catch (error) {
				console.error(error);
				unsuccessfullyAssigned.push(formatAppealForAssigningAppeals(appeal, error.message));
			}
		} else if (appeal.status != 'available_for_inspector_pickup') {
			unsuccessfullyAssigned.push(formatAppealForAssigningAppeals(appeal, 'appeal in wrong state'));
		} else if (appeal.userId != undefined) {
			unsuccessfullyAssigned.push(formatAppealForAssigningAppeals(appeal, 'appeal already assigned'));
		}
	}));
	return { successfullyAssigned: successfullyAssigned, unsuccessfullyAssigned: unsuccessfullyAssigned };
};

const validateAppealIdsPresent = function(body) {
	if (_.isEmpty(body)) {
		throw new InspectorError('Must provide appeals to assign', 400);
	}
};

const assignAppeals = async function(request, response) {
	const userId = Number.parseInt(request.headers.userid, 10)
	validateAppealIdsPresent(request.body);
	const resultantAppeals = await assignAppealsById(userId, request.body);
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

export { getAppeals, getMoreAppeals, assignAppeals };
