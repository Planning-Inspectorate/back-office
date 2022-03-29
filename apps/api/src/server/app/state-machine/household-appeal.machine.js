import { createMachine } from 'xstate';
import { validation_states, validation_actions } from './validation-states.js';
import { lpa_questionnaire_states, lpa_questionnaire_actions } from './lpa-questionnaire-states.js';

// const lpaQuestionnaireStatesStrings = {
// 	awaiting_lpa_questionnaire: 'awaiting_lpa_questionnaire',
// 	received_lpa_questionnaire: 'received_lpa_questionnaire',
// 	overdue_lpa_questionnaire: 'overdue_lpa_questionnaire'
// };

// const lpa_questionnaire_states = {
// 	awaiting_lpa_questionnaire: {
// 		entry: ['sendLPAQuestionnaire'],
// 		on: {
// 			OVERDUE: 'overdue_lpa_questionnaire',
// 			RECEIVED: 'received_lpa_questionnaire'
// 		}
// 	},
// 	received_lpa_questionnaire: {},
// 	overdue_lpa_questionnaire: {
// 		entry: ['nudgeLPAQuestionnaire']
// 	}
// };

// const lpa_questionnaire_actions = {
// 	sendLPAQuestionnaire: (_context, _event) => {
// 		console.log('Sending LPA Questionnaire...');
// 	},
// 	nudgeLPAQuestionnaire: (_context, _event) => {
// 		console.log('Sending an email to nudge LPA regarding questionnaire');
// 	}
// };

// const validation_states_strings = {
// 	received_appeal: 'received_appeal',
// 	awaiting_validation_info: 'awaiting_validation_info',
// 	valid_appeal: 'valid_appeal',
// 	invalid_appeal: 'invalid_appeal'
// };

// const validation_actions_strings = {
// 	invalid: 'INVALID',
// 	valid: 'VALID',
// 	information_missing: 'INFO_MISSING'
// };

// const validation_states = {
// 	received_appeal: {
// 		on: {
// 			INVALID: 'invalid_appeal',
// 			INFO_MISSING: 'awaiting_validation_info',
// 			VALID: 'valid_appeal'
// 		}
// 	},
// 	awaiting_validation_info: {
// 		entry: ['notifyAppellantOfMissingAppealInfo'],
// 		on: {
// 			INVALID: 'invalid_appeal',
// 			VALID: 'valid_appeal'
// 		}
// 	},
// 	valid_appeal: {
// 		always: [{ target: 'awaiting_lpa_questionnaire' }]
// 	},
// 	invalid_appeal: {
// 		entry: ['notifyAppellantOfInvalidAppeal', 'notifyLPAOfInvalidAppeal'],
// 		type: 'final'
// 	},
// };

const household_appeal_machine = createMachine({
	id: 'housing_appeal',
	initial: 'received_appeal',
	states: {
		...validation_states,
		...lpa_questionnaire_states
	},
	actions: {
		...validation_actions,
		...lpa_questionnaire_actions
	}
});

export default household_appeal_machine;
