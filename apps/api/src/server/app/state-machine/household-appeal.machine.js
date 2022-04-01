import { createMachine, interpret } from 'xstate';
import { validationStates, validationActions } from './validation-states.js';
import { lpaQuestionnaireStates, lpaQuestionnaireActions } from './lpa-questionnaire-states.js';
import { investigatorStates } from './investigator-states.js';

const createHouseholpAppealMachine = function(appealId) {
	return createMachine({
		id: 'household_appeal',
		context: {
			appealId: appealId
		},
		initial: 'received_appeal',
		states: {
			...validationStates,
			...lpaQuestionnaireStates,
			...investigatorStates
		},
	}, {
		actions: {
			...validationActions,
			...lpaQuestionnaireActions
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
