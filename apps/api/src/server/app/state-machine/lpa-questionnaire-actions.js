import lpaQuestionnaireActionsService from './lpa-questionnaire-actions.service.js';

const lpaQuestionnaireActions = {
	async sendLPAQuestionnaire(context) {
		await lpaQuestionnaireActionsService.sendLpaQuestionnaire(context.appealId);
	},
	nudgeLPAQuestionnaire: () => {
		console.log('Sending an email to nudge LPA regarding questionnaire');
	}
};

export default lpaQuestionnaireActions;
