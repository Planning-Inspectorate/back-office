// @ts-check

import { filterExists } from '@pins/platform';
import { arrayOfStatusesContainsString } from './array-of-statuses-contains-string.js';
import formatDate from './date-formatter.js';
import daysBetweenDates from './days-between-dates.js';

/** @typedef {import('@pins/api').Schema.Appeal} Appeal */
/** @typedef {import('@pins/api').Schema.AppealStatus} AppealStatus */
/** @typedef {import('@pins/api').Schema.InspectorDecision} InspectorDecision */
/** @typedef {import('@pins/api').Schema.SiteVisit} SiteVisit */

/**
 * @param {Appeal} appeal
 * @returns {Object<string, ?>} - TODO: Link this type to web/response definition
 */
export const formatAppeal = ({
	inspectorDecision,
	siteVisit,
	id: appealId,
	createdAt,
	appealStatus,
	reference,
	localPlanningDepartment,
	planningApplicationReference,
	startedAt
}) =>
	filterExists({
		appealId,
		status: formatStatus(appealStatus),
		appealReceivedDate: formatDate(createdAt, false),
		appealAge: startedAt && daysBetweenDates(startedAt, new Date()),
		reference,
		localPlanningDepartment,
		planningApplicationReference,
		bookedSiteVisit: siteVisit && formatSiteVisit(siteVisit),
		inspectorDecision: inspectorDecision && formatInspector(inspectorDecision)
	});

/**
 * @param {InspectorDecision} inspectorDecision
 * @returns {Object<string, ?>} - TODO: Link this type to web definition
 */
function formatInspector({ outcome }) {
	return { outcome };
}

/**
 * @param {SiteVisit} siteVisit
 * @returns {Object<string, ?>} - TODO: Link this type to web definition
 */
function formatSiteVisit({ visitDate, visitSlot, visitType }) {
	return {
		visitDate: formatDate(visitDate, false),
		visitSlot,
		visitType
	};
}

/**
 * @param {AppealStatus[]} appealStatuses
 * @returns {string}
 */
function formatStatus(appealStatuses) {
	if (arrayOfStatusesContainsString(appealStatuses, 'site_visit_booked')) return 'booked';
	if (arrayOfStatusesContainsString(appealStatuses, 'decision_due')) return 'decision due';
	if (arrayOfStatusesContainsString(appealStatuses, 'site_visit_not_yet_booked'))
		return 'not yet booked';
	if (arrayOfStatusesContainsString(appealStatuses, 'appeal_decided')) return 'appeal decided';
	throw new Error('Unknown status');
}
