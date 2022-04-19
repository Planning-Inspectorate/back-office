import { createMachine, interpret } from 'xstate';
import { generateValidationStates, validationActions } from './validation-states.js';
import { generateLpaQuestionnaireStates, lpaQuestionnaireActions } from './lpa-questionnaire-states.js';
import { inspectorStates, inspectorActions } from './inspector-states.js';
import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';

const validationStates = generateValidationStates('awaiting_lpa_questionnaire');
const validationStatesStrings = mapObjectKeysToStrings(validationStates);

const lpaQuestionnaireStates = generateLpaQuestionnaireStates();
const lpaQuestionnaireStatesStrings = mapObjectKeysToStrings(lpaQuestionnaireStates);

/**
 * @typedef {object} TransitionStateErrorConfig
 * @property {string} type - The state machine action being performed.
 * @property {object} context - The context on which the state machine error occurred.
 */

export class TransitionStateError extends Error {
	/**
	 * @param {string} message
	 * @param {TransitionStateErrorConfig} config
	 */
	constructor(message, { action, appeal }) {
		super(message);
		this.type = action;
		this.context = appeal;
	}
}

const createHouseholpAppealMachine = function (context) {
	return createMachine({
			id: 'household_appeal',
			context: context,
			initial: 'received_appeal',
			states: {
				...validationStates,
				...lpaQuestionnaireStates,
				...inspectorStates
			},
		}, {
		actions: {
			...validationActions,
			...lpaQuestionnaireActions,
			...inspectorActions
		}
	});
};

const transitionState = function (context, status, machineAction, throwError = false) {
	const service = interpret(createHouseholpAppealMachine(context));
	service.start(status);
	service.send({ type: machineAction });
	const nextState = service.state;
	service.stop();

	if (!nextState.changed && throwError) {
		throw new TransitionStateError(`Could not transition '${status}' using '${machineAction}'.`, {
			type: machineAction,
			context
		});
	}
	return nextState;
};

export { transitionState, validationStates, validationStatesStrings, lpaQuestionnaireStatesStrings };
