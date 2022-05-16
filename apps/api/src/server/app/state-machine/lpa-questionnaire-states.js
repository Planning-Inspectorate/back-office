const generateLpaQuestionnaireStates = () => {
	return {
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
		incomplete_lpa_questionnaire: {
			on: {
				COMPLETE: 'complete_lpa_questionnaire',
			}
		},
		complete_lpa_questionnaire: {
			always: [{ target: 'available_for_inspector_pickup' }]
		}
	};
};

export { generateLpaQuestionnaireStates };
