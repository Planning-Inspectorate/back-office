import { createMachine } from 'xstate';
import mapObjectKeysToStrings from '../../utils/map-states-to-strings.js';

/**
 * @returns {object}
 */
const appealStatesForMachine = {
	ready_to_start: {
		on: {
			starting: 'awaiting_lpa_questionnaire'
		}
	},
	awaiting_lpa_questionnaire: {
		on: {
			check_success: 'done'
		}
	},
	done: {}
};

/**
 *
 * @param {object} context
 * @returns {import('xstate').StateMachine<any, any, any>}
 */
export const createAppealsMachine = (context) => {
	return createMachine({
		id: 'cases',
		initial: 'ready_to_start',
		context,
		states: appealStatesForMachine
	});
};

export const appealStates = mapObjectKeysToStrings(appealStatesForMachine);
