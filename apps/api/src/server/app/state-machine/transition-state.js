import { interpret } from 'xstate';
import {
	createFullPlanningAppealMachine,
	fullPlanningStates
} from './full-planning-appeal.machine.js';
import { createHouseholpAppealMachine, householdStates } from './household-appeal.machine.js';

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

export const transitionState = (appealType, context, status, machineAction, throwError = false) => {
	const stateMachine =
		appealType === 'household'
			? createHouseholpAppealMachine(context)
			: (appealType === 'full planning'
			? createFullPlanningAppealMachine(context)
			: (function () {
					throw new TransitionStateError(`Unknown Appeal Type ${appealType}`);
			  }()));

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

export const appealStates = {
	...householdStates,
	...fullPlanningStates
};
