import { createMachine, interpret } from 'xstate';
import { validation_states, validation_actions } from './validation-states.js';
import { lpa_questionnaire_states, lpa_questionnaire_actions } from './lpa-questionnaire-states.js';
import { investigatorStates } from './investigator-states.js';

const createHouseholpAppealMachine = function(appealId) {
	return createMachine({
		id: 'household_appeal',
		context: {
			appealId: appealId
		},
		initial: 'received_appeal',
		states: {
			...validation_states,
			...lpa_questionnaire_states,
			...investigatorStates
		},
	}, {
		actions: {
			...validation_actions,
			...lpa_questionnaire_actions
		}
	});
};

const transitionState = function(appealId, status, machineAction) {
	const service = interpret(createHouseholpAppealMachine(appealId));
	service.start(status);
	service.send({ type: machineAction });
	const nextState = service.state;
	service.stop();
	return nextState;
};

export default transitionState;
