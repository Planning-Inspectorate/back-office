import { createMachine } from 'xstate';
import { validation_states, validation_actions } from './validation-states.js';
import { lpa_questionnaire_states, lpa_questionnaire_actions } from './lpa-questionnaire-states.js';

const household_appeal_machine = createMachine({
	id: 'household_appeal',
	initial: 'received_appeal',
	states: {
		...validation_states,
		...lpa_questionnaire_states
	},
	actions: {
		...validation_actions,
		...lpa_questionnaire_actions
	}
});

export default household_appeal_machine;
