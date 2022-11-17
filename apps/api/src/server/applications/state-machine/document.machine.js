import { createMachine } from 'xstate';
import mapObjectKeysToStrings from '../../utils/map-states-to-strings.js';

const documentStatesForMachine = {
	awaiting_upload: {
		on: {
			uploading: 'not_yet_checked'
		}
	},
	not_yet_checked: {
		on: {
			check_success: 'ready',
			check_fail: 'failed_checks'
		}
	},
	ready: {},
	failed_checks: {}
};

/**
 *
 * @param {object} context
 * @returns {import('xstate').StateMachine<any, any, any>}
 */
export const createDocumentsMachine = (context) => {
	return createMachine({
		id: 'document',
		initial: 'uploading',
		context,
		states: documentStatesForMachine
	});
};

export const applicationStates = mapObjectKeysToStrings(documentStatesForMachine);
