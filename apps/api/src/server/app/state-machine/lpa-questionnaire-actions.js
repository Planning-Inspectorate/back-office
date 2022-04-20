import lpaQuestionnaireActionsService from './lpa-questionnaire-actions.service.js';

const lpaQuestionnaireActions = {
	sendLPAQuestionnaire: async function(context, _event) {
		await lpaQuestionnaireActionsService.sendLpaQuestionnaire(context.appealId);
	},
	nudgeLPAQuestionnaire: (_context, _event) => {
		console.log('Sending an email to nudge LPA regarding questionnaire');
	}
};

export default lpaQuestionnaireActions;
