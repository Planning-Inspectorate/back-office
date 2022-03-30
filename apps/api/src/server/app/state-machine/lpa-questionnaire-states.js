const lpaQuestionnaireStatesStrings = {
	awaiting_lpa_questionnaire: 'awaiting_lpa_questionnaire',
	received_lpa_questionnaire: 'received_lpa_questionnaire',
	overdue_lpa_questionnaire: 'overdue_lpa_questionnaire'
};

const lpa_questionnaire_states = {
	awaiting_lpa_questionnaire: {
		entry: ['sendLPAQuestionnaire'],
		on: {
			OVERDUE: 'overdue_lpa_questionnaire',
			RECEIVED: 'received_lpa_questionnaire'
		}
	},
	received_lpa_questionnaire: {},
	overdue_lpa_questionnaire: {
		entry: ['nudgeLPAQuestionnaire']
	}
};

const lpa_questionnaire_actions = {
	sendLPAQuestionnaire: (_context, _event) => {
		console.log('Sending LPA Questionnaire...');
	},
	nudgeLPAQuestionnaire: (_context, _event) => {
		console.log('Sending an email to nudge LPA regarding questionnaire');
	}
};

export { lpaQuestionnaireStatesStrings, lpa_questionnaire_states, lpa_questionnaire_actions };
