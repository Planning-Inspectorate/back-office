import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';
import lpaQuestionnaireActions from './lpa-questionnaire.actions.js';

const lpa_questionnaire_actions = {
	sendLPAQuestionnaire: async function(context, _event) {
		await lpaQuestionnaireActions.sendLpaQuestionnaire(context.appealId);
	},
	nudgeLPAQuestionnaire: (_context, _event) => {
		console.log('Sending an email to nudge LPA regarding questionnaire');
	}
};

const lpa_questionnaire_states = {
	awaiting_lpa_questionnaire: {
		entry: ['sendLPAQuestionnaire'],
		on: {
			OVERDUE: 'overdue_lpa_questionnaire',
			RECEIVED: 'received_lpa_questionnaire'
		}
	},
	received_lpa_questionnaire: {
		on: {
			COMPLETE: 'complete_lpa_questionnaire',
			INCOMPLETE: 'incomplete_lpa_questionnaire'
		}
	},
	overdue_lpa_questionnaire: {
		entry: ['nudgeLPAQuestionnaire'],
		on: {
			RECEIVED: 'received_lpa_questionnaire'
		}
	},
	complete_lpa_questionnaire: {
		always: [{ target: 'available_for_investigator_pickup' }]
	},
	incomplete_lpa_questionnaire: {
		on: {
			COMPLETE: 'complete_lpa_questionnaire',
		}
	}
};

const lpaQuestionnaireStatesStrings = mapObjectKeysToStrings(lpa_questionnaire_states);

export { lpaQuestionnaireStatesStrings, lpa_questionnaire_states, lpa_questionnaire_actions };
