import mapObjectKeysToStrings from '../utils/map-states-to-strings.js';
import lpaQuestionnaireActionsService from './lpa-questionnaire.actions.js';

const lpaQuestionnaireActions = {
	sendLPAQuestionnaire: async function(context, _event) {
		await lpaQuestionnaireActionsService.sendLpaQuestionnaire(context.appealId);
	},
	nudgeLPAQuestionnaire: (_context, _event) => {
		console.log('Sending an email to nudge LPA regarding questionnaire');
	}
};

const lpaQuestionnaireStates = {
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

const lpaQuestionnaireStatesStrings = mapObjectKeysToStrings(lpaQuestionnaireStates);

export { lpaQuestionnaireStatesStrings, lpaQuestionnaireStates, lpaQuestionnaireActions };
