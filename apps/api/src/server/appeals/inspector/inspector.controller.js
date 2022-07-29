import appealRepository from '../../repositories/appeal.repository.js';
import { formatAppeal } from '../../utils/appeal-formatter.js';
import { appealStates } from '../../utils/transition-state.js';
import { appealFormatter } from './appeal-formatter.js';
import * as inspector from './inspector.service.js';

/** @typedef {import('@pins/express').MulterFile} MulterFile */
/** @typedef {import('@pins/api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/api').Schema.InspectorDecisionOutcomeType} InspectorDecisionOutcomeType */
/** @typedef {import('@pins/api').Schema.SiteVisitType} SiteVisitType */

/**
 * @type {import('express').RequestHandler}
 */
const getAppeals = async (request, response) => {
	const userId = request.get('userId');
	const appeals = await appealRepository.getByStatusesAndUserId(
		[
			appealStates.site_visit_not_yet_booked,
			appealStates.site_visit_booked,
			appealStates.decision_due,
			'picked_up'
		],
		userId
	);
	const appealsForResponse = appeals.map((appeal) =>
		appealFormatter.formatAppealForAllAppeals(appeal)
	);

	response.send(appealsForResponse);
};

/**
 * @type {import('express').RequestHandler}
 */
const getAppealDetails = async (request, response) => {
	const appeal = await appealRepository.getById(request.params.appealId, {
		appellant: true,
		validationDecision: true,
		address: true,
		latestLPAReviewQuestionnaire: true,
		appealDetailsFromAppellant: true,
		lpaQuestionnaire: true,
		siteVisit: true
	});
	const formattedAppeal = appealFormatter.formatAppealForAppealDetails(appeal);

	response.send(formattedAppeal);
};

/**
 * @type {import('express').RequestHandler}
 */
const assignAppeals = async (request, response) => {
	const userId = request.get('userId');
	const resultantAppeals = await inspector.assignAppealsById(userId, request.body);

	response.send(resultantAppeals);
};

/**
 * @type {import('express').RequestHandler}
 */
const getMoreAppeals = async (request, response) => {
	const moreAppeals = await appealRepository.getByStatuses({
		statuses: [appealStates.available_for_inspector_pickup],
		includeAddress: true,
		includeAppellant: false,
		includeLPAQuestionnaire: true,
		includeAppealDetailsFromAppellant: true
	});
	const moreAppealsFormatted = moreAppeals.map((appeal) =>
		appealFormatter.formatAppealForMoreAppeals(appeal)
	);

	response.send(moreAppealsFormatted);
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
 * @type {import('express').RequestHandler<AppealParams, *, BookSiteVisitRequestBody>}
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

	const updatedAppeal = await appealRepository.getById(params.appealId, { siteVisit: true });

	response.send(formatAppeal(updatedAppeal));
};

/**
 * @typedef {object} IssueDecisionRequestBody
 * @property {InspectorDecisionOutcomeType} outcome
 */

/**
 * Issue a decision for an appeal and serve the updated appeal in response.
 *
 * @type {import('express').RequestHandler<AppealParams, *, IssueDecisionRequestBody>}
 * @property {MulterFile} decisionLetter
 */
export const issueDecision = async ({ body, file, params }, response) => {
	await inspector.issueDecision({
		appealId: params.appealId,
		outcome: body.outcome,
		decisionLetter: file
	});

	const updatedAppeal = await appealRepository.getById(params.appealId, {
		inspectorDecision: true
	});

	response.send(formatAppeal(updatedAppeal));
};

export { getAppeals, assignAppeals, getAppealDetails, getMoreAppeals };
