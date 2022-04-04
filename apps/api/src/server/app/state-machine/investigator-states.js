import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';

const investigatorStates = {
	available_for_investigator_pickup: {
		on: {
			PICKUP: 'site_visit_not_yet_booked'
		}
	},
	site_visit_not_yet_booked: {}
};

const investigatorStatesStrings = mapObjectKeysToStrings(investigatorStates);

export { investigatorStates, investigatorStatesStrings };
