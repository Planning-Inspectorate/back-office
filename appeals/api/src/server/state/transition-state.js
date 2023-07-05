import { interpret } from 'xstate';
import createStateMachine from './create-state-machine.js';
import logger from '../utils/logger.js';
import appealRepository from '../repositories/appeal.repository.js';

/**
 * @param {{
 *  appealId: number;
 *  appealType: string;
 *  currentState: string;
 *  trigger: string;
 * }} param0
 */
const transitionState = async ({ appealId, appealType, currentState, trigger }) => {
	const stateMachine = createStateMachine(appealType, currentState);
	const stateMachineService = interpret(stateMachine);

	stateMachineService.onTransition((state) =>
		logger.debug(`Appeal ${appealId} transitioned to ${state.value}`)
	);
	stateMachineService.start();
	stateMachineService.send({ type: trigger });

	const newState = String(stateMachineService.state.value);

	if (newState !== currentState) {
		await appealRepository.updateAppealStatus(appealId, newState);
	}

	stateMachineService.stop();
};

export default transitionState;
