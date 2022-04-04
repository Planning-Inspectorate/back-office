import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';

const investigatorStates = {
	available_for_investigator_pickup: {
		on: {
			PICKUP: 'site_visit_not_yet_booked'
		}
	},
	site_visit_not_yet_booked: {},
	available_for_investigator_pickup: {}
};

const investigatorStatesStrings = mapObjectKeysToStrings(investigatorStates);

export { investigatorStates, investigatorStatesStrings };
