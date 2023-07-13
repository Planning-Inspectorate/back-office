import { interpret } from 'xstate';
import createStateMachine from './create-state-machine.js';
import logger from '../utils/logger.js';
import appealRepository from '../repositories/appeal.repository.js';

/** @typedef {import('@prisma/client').AppealType} AppealType */
/** @typedef {import('@prisma/client').AppealStatus} AppealStatus */
/** @typedef {import('xstate').StateValue} StateValue */

/**
 *  @param {number} appealId
 *  @param {AppealType | null} appealType
 *  @param {AppealStatus[]} currentState
 *  @param {string} trigger
 */
const transitionState = async (appealId, appealType, currentState, trigger) => {
	const currentStatus = currentState[0].status;
	const stateMachine = createStateMachine(appealType?.shorthand, currentStatus);
	const stateMachineService = interpret(stateMachine);

	stateMachineService.onTransition((/** @type {{value: StateValue}} */ state) =>
		logger.debug(`Appeal ${appealId} transitioned to ${state.value}`)
	);
	stateMachineService.start();
	stateMachineService.send({ type: trigger });

	const newState = String(stateMachineService.state.value);

	if (newState !== currentStatus) {
		await appealRepository.updateAppealStatus(appealId, newState);
	}

	stateMachineService.stop();
};

export default transitionState;
