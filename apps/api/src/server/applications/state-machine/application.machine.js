import { createMachine } from 'xstate';
import mapObjectKeysToStrings from '../../utils/map-states-to-strings.js';

const applicationStatesForMachine = {
	draft: {
		on: {
			START: 'pre_application'
		}
	},
	pre_application: {}
};

/**
 *
 * @param {object} context
 * @returns {import('xstate').StateMachine<any, any, any>}
 */
export const createApplicationsMachine = (context) => {
	return createMachine({
		id: 'application',
		context,
		initial: 'draft',
		states: applicationStatesForMachine
	});
};

export const applicationStates = mapObjectKeysToStrings(applicationStatesForMachine);
