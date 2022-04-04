import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';
import investigatorActionsService from './investigator.actions.js';

const inspectionTypesThatSendEmail = new Set([
	'accompanied',
	'access required'
]);

const investigatorActions = {
	notifyAppellantOfBookedSiteVisit: async function(context, _event) {
		if (inspectionTypesThatSendEmail.has(context.inspectionType)) {
			await investigatorActionsService.sendEmailToAppellantWithSiteVisitBooking(context.appealId);
		}
	}
};

const investigatorStates = {
	available_for_investigator_pickup: {
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

const investigatorStatesStrings = mapObjectKeysToStrings(investigatorStates);

export { investigatorStates, investigatorStatesStrings, investigatorActions };
