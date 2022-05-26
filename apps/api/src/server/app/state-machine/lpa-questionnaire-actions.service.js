import lpaQuestionnaireRepository from '../repositories/lpa-questionnaire.repository.js';

const lpaQuestionnaireActionsService = {
	async sendLpaQuestionnaire(appealId) {
		console.log(`Sending LPA questionnaire to AppealID ${appealId}`);
		await lpaQuestionnaireRepository.createNewLpaQuestionnaire(appealId);
		console.log('Sent LPA questionnaire');
	}
};

export default lpaQuestionnaireActionsService;
