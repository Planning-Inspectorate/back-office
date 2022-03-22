const lpa_questionnaire_states = {
	with_case_officer: {
		entry: ['sendLPAQuestionnaire'],
		on: {
			COMPLETE_QUESTIONNAIRE_RECEIVED: 'with_inspector',
			INCOMPLETE_QUESTIONNAIRE_RECEIVE: 'awaiting_complete_questionnaire'
		}
	},
	awaiting_complete_questionnaire: {
		on: {
			COMPLETE_QUESTIONNAIRE_RECEIVED: 'with_inspector'
		}
	},
	with_inspector: {}
};

const lpa_questionnaire_actions = {
	sendLPAQuestionnaire: (_context, _event) => {
		console.log('Sending LPA Questionnaire...');
	},
};

export { lpa_questionnaire_states, lpa_questionnaire_actions };
