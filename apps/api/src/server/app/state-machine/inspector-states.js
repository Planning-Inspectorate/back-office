import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';
import inspectorActionsService from './inspector.actions.js';

/** @typedef {import('@pins/api').Schema.AppealStatusType} AppealStatusType */

const inspectionTypesThatSendEmail = new Set([
	'accompanied',
	'access required'
]);

const inspectorActions = {
	async notifyAppellantOfBookedSiteVisit(context, _event) {
		if (inspectionTypesThatSendEmail.has(context.inspectionType)) {
			await inspectorActionsService.sendEmailToAppellantWithSiteVisitBooking(context.appealId);
		}
	},
	async notifyAppellantOfDecision(context, _event) {
		await inspectorActionsService.sendEmailToLPAAndAppellantWithDeciion(context.appealId, context.decision);
	}
};

const inspectorBookingStates = {
	site_visit_not_yet_booked: {
		on: {
			BOOK: 'site_visit_booked',
		},
	},
	site_visit_booked: {
		entry: ['notifyAppellantOfBookedSiteVisit'],
		on: {
			BOOKING_PASSED: 'decision_due',
		},
	},
	decision_due: {
		on: {
			DECIDE: 'appeal_decided',
		},
	},
	appeal_decided: {
		entry: ['notifyAppellantOfDecision'],
	},
};

const generateInspectorPickupStates = function(stateAfterPickup, additionalStates) {
	return {
		available_for_inspector_pickup: {
			on: {
				PICKUP: stateAfterPickup
			}
		},
		...additionalStates
	};
};

const inspectorStates = generateInspectorPickupStates('site_visit_not_yet_booked', inspectorBookingStates)
const inspectorStatesStrings = /** @type {Record<AppealStatusType, AppealStatusType>} */ (mapObjectKeysToStrings(inspectorStates));

export { inspectorStates, inspectorStatesStrings, inspectorActions, inspectorBookingStates, generateInspectorPickupStates };
