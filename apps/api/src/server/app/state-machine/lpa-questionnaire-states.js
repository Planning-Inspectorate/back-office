import lpaQuestionnaireActions from './lpa-questionnaire.actions.js';

const lpaQuestionnaireStatesStrings = {
	awaiting_lpa_questionnaire: 'awaiting_lpa_questionnaire',
	received_lpa_questionnaire: 'received_lpa_questionnaire',
	overdue_lpa_questionnaire: 'overdue_lpa_questionnaire',
	complete_lpa_questionnaire: 'complete_lpa_questionnaire',
	incomplete_lpa_questionnaire: 'incomplete_lpa_questionnaire'
};

const lpa_questionnaire_actions = {
	sendLPAQuestionnaire: async function(context, _event) {
		console.log('I am here');
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
	complete_lpa_questionnaire: {},
	incomplete_lpa_questionnaire: {
		on: {
			COMPLETE: 'complete_lpa_questionnaire',
		}
	}
};

export { lpaQuestionnaireStatesStrings, lpa_questionnaire_states, lpa_questionnaire_actions };
