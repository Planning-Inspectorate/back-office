// @ts-nocheck
import { interpret } from 'xstate';
import { createAppealsMachine } from '../appeals/state-machine/appeal.machine.js';
import { createDocumentsMachine } from '../appeals/state-machine/document.machine.js';

export class TransitionStateError extends Error {
	/**
	 * @param {string} message
	 * @param {{type: string, context: object}} config
	 */
	constructor(message, { type, context }) {
		super(message);
		this.type = type;
		this.context = context;
	}
}

/**
 * @param {import('@pins/appeals.api').CaseType} caseType
 * @returns {Function}
 */
const mapStateMachine = (caseType) => {
	const stateMachines = {
		appeals: createAppealsMachine,
		document: createDocumentsMachine
	};

	const stateMachine = stateMachines[caseType];

	if (typeof stateMachine === 'undefined') {
		throw new TransitionStateError(`Unknown Appeal Type ${caseType}`, {
			type: caseType,
			context: {}
		});
	}

	return stateMachine;
};

/**
 * @param {{caseType: import('@pins/appeals.api').CaseType, context: object, status: import('xstate').StateValue, machineAction: string, throwError: boolean}} transitionParams
 * @returns {import('xstate').State<any, any, any, any, any>}
 */
export const transitionState = ({
	caseType,
	context,
	status,
	machineAction,
	throwError = false
}) => {
	const stateMachine = mapStateMachine(caseType)(context);

	const service = interpret(stateMachine);

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
