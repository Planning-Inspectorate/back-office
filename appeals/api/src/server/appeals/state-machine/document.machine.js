import { createMachine } from 'xstate';
import mapObjectKeysToStrings from '../../utils/map-states-to-strings.js';

/**
 * @returns {object}
 */
const documentStatesForMachine = {
	awaiting_upload: {
		on: {
			uploading: 'awaiting_virus_check'
		}
	},
	awaiting_virus_check: {
		on: {
			check_success: 'not_user_checked',
			check_fail: 'failed_virus_check'
		}
	},
	not_user_checked: {},
	failed_virus_check: {}
};

/**
 *
 * @param {object} context
 * @returns {import('xstate').StateMachine<any, any, any>}
 */
export const createDocumentsMachine = (context) => {
	return createMachine({
		id: 'document',
		initial: 'awaiting_upload',
		context,
		states: documentStatesForMachine
	});
};

export const applicationStates = mapObjectKeysToStrings(documentStatesForMachine);
