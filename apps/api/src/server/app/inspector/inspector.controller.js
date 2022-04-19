import _ from 'lodash';
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
	const appeal = await appealRepository.getByIdIncluding(request.params.appealId, {
		appellant: true, 
		validationDecision: {
			where: {
				decision: 'complete',
			},
		},
		lpaQuestionnaire: true,
		appealDetailsFromAppellant: true,
		address: true,
		siteVisit: true
	});
	const formattedAppeal = {
		appealId: appeal.id,
		reference: appeal.reference,
		provisionalSiteVisitType: provisionalAppealSiteVisitType(appeal),
		appellantName: appeal.appellant.name,
		agentName: appeal.appellant.agentName,
		email: appeal.appellant.email,
		appealReceivedDate: formatDate(appeal.createdAt, false),
		appealAge: daysBetweenDates(appeal.startedAt, new Date()),
		descriptionOfDevelopment: appeal.validationDecision[0].descriptionOfDevelopment,
		extraConditions: appeal.lpaQuestionnaire.extraConditions,
		affectsListedBuilding: appeal.lpaQuestionnaire.affectsListedBuilding,
		inGreenBelt: appeal.lpaQuestionnaire.inGreenBelt,
		inOrNearConservationArea: appeal.lpaQuestionnaire.inOrNearConservationArea,
		emergingDevelopmentPlanOrNeighbourhoodPlan: appeal.lpaQuestionnaire.emergingDevelopmentPlanOrNeighbourhoodPlan,
		emergingDevelopmentPlanOrNeighbourhoodPlanDescription: appeal.lpaQuestionnaire.emergingDevelopmentPlanOrNeighbourhoodPlanDescription,
		address: formatAddressLowerCase(appeal.address),
		localPlanningDepartment: appeal.localPlanningDepartment,
		...(appeal.siteVisit && { bookedSiteVisit: {
			visitDate: formatDate(appeal.siteVisit.visitDate, false),
			visitSlot: appeal.siteVisit.visitSlot,
			visitType: appeal.siteVisit.visitType
		} }),
		lpaAnswers: {
			canBeSeenFromPublic: appeal.lpaQuestionnaire.siteVisibleFromPublicLand,
			canBeSeenFromPublicDescription: appeal.lpaQuestionnaire.siteVisibleFromPublicLandDescription,
			inspectorNeedsToEnterSite: appeal.lpaQuestionnaire.doesInspectorNeedToEnterSite,
			inspectorNeedsToEnterSiteDescription: appeal.lpaQuestionnaire.doesInspectorNeedToEnterSiteDescription,
			inspectorNeedsAccessToNeighboursLand: appeal.lpaQuestionnaire.doesInspectorNeedToAccessNeighboursLand,
			inspectorNeedsAccessToNeighboursLandDescription: appeal.lpaQuestionnaire.doesInspectorNeedToAccessNeighboursLandDescription,
			healthAndSafetyIssues: appeal.lpaQuestionnaire.healthAndSafetyIssues,
			healthAndSafetyIssuesDescription: appeal.lpaQuestionnaire.healthAndSafetyIssuesDescription,
			appealsInImmediateArea: appeal.lpaQuestionnaire.appealsInImmediateAreaBeingConsidered
		},
		appellantAnswers: {
			canBeSeenFromPublic: appeal.appealDetailsFromAppellant.siteVisibleFromPublicLand,
			canBeSeenFromPublicDescription: appeal.appealDetailsFromAppellant.siteVisibleFromPublicLandDescription,
			appellantOwnsWholeSite: appeal.appealDetailsFromAppellant.appellantOwnsWholeSite,
			appellantOwnsWholeSiteDescription: appeal.appealDetailsFromAppellant.appellantOwnsWholeSiteDescription,
			healthAndSafetyIssues: appeal.appealDetailsFromAppellant.healthAndSafetyIssues,
			healthAndSafetyIssuesDescription: appeal.appealDetailsFromAppellant.healthAndSafetyIssuesDescription
		},
		Documents: [
			{
				Type: 'planning application form',
				Filename: 'planning-application.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'decision letter',
				Filename: 'decision-letter.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'appeal statement',
				Filename: 'appeal-statement.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'supporting document',
				Filename: 'other-document-1.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'supporting document',
				Filename: 'other-document-2.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'supporting document',
				Filename: 'other-document-3.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'planning officers report',
				Filename: 'planning-officers-report.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'plans used to reach decision',
				Filename: 'plans-used-to-reach-decision.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'statutory development plan policy',
				Filename: 'policy-and-supporting-text-1.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'statutory development plan policy',
				Filename: 'policy-and-supporting-text-2.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'statutory development plan policy',
				Filename: 'policy-and-supporting-text-3.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'other relevant policy',
				Filename: 'policy-and-supporting-text-1.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'other relevant policy',
				Filename: 'policy-and-supporting-text-2.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'other relevant policy',
				Filename: 'policy-and-supporting-text-3.pdf',
				URL: 'localhost:8080'
			},
			{
				Type: 'conservation area guidance',
				Filename: 'conservation-area-plan.pdf',
				URL: 'localhost:8080'
			}
		]
	};
	response.send(formattedAppeal);
};

const validateAppealIdsPresent = function(body) {
	if (_.isEmpty(body)) {
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
