import { createMachine, interpret } from 'xstate';
import { validationStates, validationActions } from './validation-states.js';
import { lpaQuestionnaireStates, lpaQuestionnaireActions } from './lpa-questionnaire-states.js';
import { investigatorStates, investigatorActions } from './investigator-states.js';

const createHouseholpAppealMachine = function(context) {
	return createMachine({
		id: 'household_appeal',
		context: context,
		initial: 'received_appeal',
		states: {
			...validationStates,
			...lpaQuestionnaireStates,
			...investigatorStates
		},
	}, {
		actions: {
			...validationActions,
			...lpaQuestionnaireActions,
			...investigatorActions
		}
	});
};

const transitionState = function(context, status, machineAction) {
	const service = interpret(createHouseholpAppealMachine(context));
	service.start(status);
	service.send({ type: machineAction });
	const nextState = service.state;
	service.stop();
	return nextState;
};

export default transitionState;
