import { filter, isEmpty } from 'lodash-es';
import { addWeeksToDate } from '../../utils/add-weeks-to-date.js';
import formatAddressLowerCase from '../../utils/address-formatter-lowercase.js';
import { arrayOfStatusesContainsString } from '../../utils/array-of-statuses-contains-string.js';
import { buildAppealCompundStatus } from '../../utils/build-appeal-compound-status.js';
import formatDate from '../../utils/date-formatter.js';
import daysBetweenDates from '../../utils/days-between-dates.js';
import { getAppealStatusCreatedAt } from '../../utils/get-appeal-status-created-at.js';
import { weeksReceivingDocuments } from '../state-machine/full-planning-appeal.machine.js';
import { inspectorStatesStrings } from '../state-machine/inspector-states.js';
import { appealStates } from '../state-machine/transition-state.js';

const provisionalAppealSiteVisitType = (appeal) => {
	return !appeal.lpaQuestionnaire.siteVisibleFromPublicLand ||
		!appeal.appealDetailsFromAppellant.siteVisibleFromPublicLand
		? 'access required'
		: 'unaccompanied';
};

/** @typedef {import('@pins/inspector').Appeal} Appeal */
/** @typedef {import('@pins/inspector').AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/inspector').SiteVisitType} SiteVisitType */

const formatStatus = (appealStatuses) => {
	if (arrayOfStatusesContainsString(appealStatuses, inspectorStatesStrings.site_visit_booked)) return 'booked';
	if (arrayOfStatusesContainsString(appealStatuses, inspectorStatesStrings.decision_due)) return 'decision due';
	if (
		arrayOfStatusesContainsString(
			appealStatuses,
			inspectorStatesStrings.site_visit_not_yet_booked
		) ||
		arrayOfStatusesContainsString(appealStatuses, 'picked_up')
	) return 'not yet booked';
	throw new Error('Unknown status');
};

const calculateExpectedSiteVisitBookingAvailableDate = (appealStatus) => {
	if (arrayOfStatusesContainsString(appealStatus, 'available_for_statements')) return addWeeksToDate(
			getAppealStatusCreatedAt(appealStatus, 'available_for_statements'),
			weeksReceivingDocuments.statements + weeksReceivingDocuments.finalComments
		);
	if (arrayOfStatusesContainsString(appealStatus, 'available_for_final_comments')) return addWeeksToDate(
			getAppealStatusCreatedAt(appealStatus, 'available_for_final_comments'),
			weeksReceivingDocuments.finalComments
		);
	throw new Error('Unknown status');
};

export const appealFormatter = {
	formatAppealForAssigningAppeals(appeal, reason) {
		return {
			appealId: appeal.id,
			reference: appeal.reference,
			appealType: appeal.appealType.shorthand,
			specialist: 'General',
			provisionalVisitType: provisionalAppealSiteVisitType(appeal),
			appealAge: daysBetweenDates(appeal.startedAt, new Date()),
			appealSite: formatAddressLowerCase(appeal.address),
			...(typeof reason !== 'undefined' && { reason })
		};
	},
	formatAppealForAllAppeals(appeal) {
		return {
			appealId: appeal.id,
			appealAge: daysBetweenDates(appeal.startedAt, new Date()),
			appealSite: formatAddressLowerCase(appeal.address),
			appealType: appeal.appealType.shorthand,
			reference: appeal.reference,
			...(!isEmpty(appeal.siteVisit) && { siteVisitDate: formatDate(appeal.siteVisit.visitDate) }),
			...(!isEmpty(appeal.siteVisit) && { siteVisitSlot: appeal.siteVisit.visitSlot }),
			...(!isEmpty(appeal.siteVisit) && { siteVisitType: appeal.siteVisit.visitType }),
			...(isEmpty(appeal.siteVisit) && {
				provisionalVisitType: provisionalAppealSiteVisitType(appeal)
			}),
			status: formatStatus(appeal.appealStatus)
		};
	},
	formatAppealForMoreAppeals(appeal) {
		return {
			appealId: appeal.id,
			reference: appeal.reference,
			address: appeal.address,
			appealType: 'HAS',
			specialist: 'General',
			provisionalVisitType: provisionalAppealSiteVisitType(appeal),
			appealAge: daysBetweenDates(appeal.startedAt, new Date())
		};
	},
	formatAppealForAppealDetails(appeal) {
		const completeValidationDecision = filter(appeal.validationDecision, {
			decision: 'complete'
		})[0];
		const isAvailableForSiteBooking =
			buildAppealCompundStatus(appeal.appealStatus) === appealStates.site_visit_not_yet_booked;
		const isPastBooking = [
			appealStates.site_visit_booked,
			appealStates.decision_due,
			appealStates.decided
		].includes(buildAppealCompundStatus(appeal.appealStatus));

		return {
			appealId: appeal.id,
			reference: appeal.reference,
			provisionalSiteVisitType: provisionalAppealSiteVisitType(appeal),
			status: formatStatus(appeal.appealStatus),
			availableForSiteVisitBooking: isAvailableForSiteBooking,
			...(!isAvailableForSiteBooking &&
				!isPastBooking && {
					expectedSiteVisitBookingAvailableFrom: formatDate(
						calculateExpectedSiteVisitBookingAvailableDate(appeal.appealStatus),
						false
					)
				}),
			appellantName: appeal.appellant.name,
			agentName: appeal.appellant.agentName,
			email: appeal.appellant.email,
			appealReceivedDate: formatDate(appeal.createdAt, false),
			appealAge: daysBetweenDates(appeal.startedAt, new Date()),
			descriptionOfDevelopment: completeValidationDecision.descriptionOfDevelopment,
			extraConditions: appeal.lpaQuestionnaire.extraConditions,
			affectsListedBuilding: appeal.lpaQuestionnaire.affectsListedBuilding,
			inGreenBelt: appeal.lpaQuestionnaire.inGreenBelt,
			inOrNearConservationArea: appeal.lpaQuestionnaire.inOrNearConservationArea,
			emergingDevelopmentPlanOrNeighbourhoodPlan:
				appeal.lpaQuestionnaire.emergingDevelopmentPlanOrNeighbourhoodPlan,
			emergingDevelopmentPlanOrNeighbourhoodPlanDescription:
				appeal.lpaQuestionnaire.emergingDevelopmentPlanOrNeighbourhoodPlanDescription,
			address: formatAddressLowerCase(appeal.address),
			localPlanningDepartment: appeal.localPlanningDepartment,
			...(appeal.siteVisit && {
				bookedSiteVisit: {
					visitDate: formatDate(appeal.siteVisit.visitDate, false),
					visitSlot: appeal.siteVisit.visitSlot,
					visitType: appeal.siteVisit.visitType
				}
			}),
			lpaAnswers: {
				canBeSeenFromPublic: appeal.lpaQuestionnaire.siteVisibleFromPublicLand,
				canBeSeenFromPublicDescription:
					appeal.lpaQuestionnaire.siteVisibleFromPublicLandDescription,
				inspectorNeedsToEnterSite: appeal.lpaQuestionnaire.doesInspectorNeedToEnterSite,
				inspectorNeedsToEnterSiteDescription:
					appeal.lpaQuestionnaire.doesInspectorNeedToEnterSiteDescription,
				inspectorNeedsAccessToNeighboursLand:
					appeal.lpaQuestionnaire.doesInspectorNeedToAccessNeighboursLand,
				inspectorNeedsAccessToNeighboursLandDescription:
					appeal.lpaQuestionnaire.doesInspectorNeedToAccessNeighboursLandDescription,
				healthAndSafetyIssues: appeal.lpaQuestionnaire.healthAndSafetyIssues,
				healthAndSafetyIssuesDescription: appeal.lpaQuestionnaire.healthAndSafetyIssuesDescription,
				appealsInImmediateArea: appeal.lpaQuestionnaire.appealsInImmediateAreaBeingConsidered
			},
			appellantAnswers: {
				canBeSeenFromPublic: appeal.appealDetailsFromAppellant.siteVisibleFromPublicLand,
				canBeSeenFromPublicDescription:
					appeal.appealDetailsFromAppellant.siteVisibleFromPublicLandDescription,
				appellantOwnsWholeSite: appeal.appealDetailsFromAppellant.appellantOwnsWholeSite,
				appellantOwnsWholeSiteDescription:
					appeal.appealDetailsFromAppellant.appellantOwnsWholeSiteDescription,
				healthAndSafetyIssues: appeal.appealDetailsFromAppellant.healthAndSafetyIssues,
				healthAndSafetyIssuesDescription:
					appeal.appealDetailsFromAppellant.healthAndSafetyIssuesDescription
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
	}
};
