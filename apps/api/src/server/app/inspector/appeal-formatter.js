import _ from 'lodash';
import daysBetweenDates from '../utils/days-between-dates.js';
import formatAddressLowerCase from '../utils/address-formatter-lowercase.js';
import { inspectorStatesStrings } from '../state-machine/inspector-states.js';
import formatDate from '../utils/date-formatter.js';
import { arrayOfStatusesContainsString } from '../utils/array-of-statuses-contains-string.js';

const provisionalAppealSiteVisitType = function (appeal) {
	return (!appeal.lpaQuestionnaire.siteVisibleFromPublicLand || !appeal.appealDetailsFromAppellant.siteVisibleFromPublicLand) ?
		'access required' : 'unaccompanied';
};

/** @typedef {import('@pins/inspector').Appeal} Appeal */
/** @typedef {import('@pins/inspector').AppealOutcome} AppealOutcome */
/** @typedef {import('@pins/inspector').SiteVisitType} SiteVisitType */

const formatStatus = function (appealStatuses) {
	if (arrayOfStatusesContainsString(appealStatuses, inspectorStatesStrings.site_visit_booked)) {
		return 'booked';
	} else if (arrayOfStatusesContainsString(appealStatuses, inspectorStatesStrings.decision_due)) {
		return 'decision due';
	} else if (arrayOfStatusesContainsString(appealStatuses, inspectorStatesStrings.site_visit_not_yet_booked)) {
		return 'not yet booked';
	} else {
		console.log(appealStatuses);
		throw new Error('Unknown status');
	}
};

export const appealFormatter = {
	formatAppealForAssigningAppeals: function (appeal, reason) {
		return {
			appealId: appeal.id,
			reference: appeal.reference,
			appealType: 'HAS',
			specialist: 'General',
			provisionalVisitType: provisionalAppealSiteVisitType(appeal),
			appealAge: daysBetweenDates(appeal.startedAt, new Date()),
			appealSite: formatAddressLowerCase(appeal.address),
			...(reason !== undefined && { reason })
		};
	},
	formatAppealForAllAppeals: function (appeal) {
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
			status: formatStatus(appeal.appealStatus),
		};
	}
};
