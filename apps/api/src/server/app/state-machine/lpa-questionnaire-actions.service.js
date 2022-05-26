import pino from 'pino';
import lpaQuestionnaireRepository from '../repositories/lpa-questionnaire.repository.js';

const lpaQuestionnaireActionsService = {
	async sendLpaQuestionnaire(appealId) {
		pino.log(`Sending LPA questionnaire to AppealID ${appealId}`);
		await lpaQuestionnaireRepository.createNewLpaQuestionnaire(appealId);
		pino.log('Sent LPA questionnaire');
	}
};

export default lpaQuestionnaireActionsService;
