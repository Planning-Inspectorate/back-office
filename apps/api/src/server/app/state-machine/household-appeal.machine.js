import { createMachine } from 'xstate';
import { validation_states, validation_actions } from './validation-states.js';
import { lpa_questionnaire_states, lpa_questionnaire_actions } from './lpa-questionnaire-states.js';

const createHouseholpAppealMachine = function(appealId) {
	return createMachine({
		id: 'household_appeal',
		context: {
			appealId: appealId
		},
		initial: 'received_appeal',
		states: {
			...validation_states,
			...lpa_questionnaire_states
		},

	}, {
		actions: {
			...validation_actions,
			...lpa_questionnaire_actions
		}
	});
};

export default createHouseholpAppealMachine;
