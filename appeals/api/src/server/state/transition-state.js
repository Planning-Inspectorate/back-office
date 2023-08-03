import { interpret } from 'xstate';
import createStateMachine from './create-state-machine.js';
import logger from '#utils/logger.js';
import appealStatusRepository from '#repositories/appeal-status.repository.js';

/** @typedef {import('#db-client').AppealType} AppealType */
/** @typedef {import('#db-client').AppealStatus} AppealStatus */
/** @typedef {import('xstate').StateValue} StateValue */

/**
 * @param {number} appealId
 * @param {AppealType | null} appealType
 * @param {AppealStatus[]} currentState
 * @param {string} trigger
 * @returns {Promise<void>}
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
		await appealStatusRepository.updateAppealStatusByAppealId(appealId, newState);
	}

	stateMachineService.stop();
};

export default transitionState;
