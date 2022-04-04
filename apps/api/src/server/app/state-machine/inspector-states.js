import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';
import inspectorActionsService from './inspector.actions.js';

const inspectionTypesThatSendEmail = new Set([
	'accompanied',
	'access required'
]);

const inspectorActions = {
	notifyAppellantOfBookedSiteVisit: async function(context, _event) {
		if (inspectionTypesThatSendEmail.has(context.inspectionType)) {
			await inspectorActionsService.sendEmailToAppellantWithSiteVisitBooking(context.appealId);
		}
	}
};

const inspectorStates = {
	available_for_inspector_pickup: {
		on: {
			PICKUP: 'site_visit_not_yet_booked'
		}
	},
	site_visit_not_yet_booked: {
		on: {
			BOOK: 'site_visit_booked'
		}
	},
	site_visit_booked: {
		entry: ['notifyAppellantOfBookedSiteVisit'],
		on: {
			BOOKING_PASSED: 'decision_due'
		}
	},
	decision_due: {}
};

const inspectorStatesStrings = mapObjectKeysToStrings(inspectorStates);

export { inspectorStates, inspectorStatesStrings, inspectorActions };
