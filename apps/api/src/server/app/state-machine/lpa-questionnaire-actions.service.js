import logger from '../../app/lib/logger.js';
import lpaQuestionnaireRepository from '../repositories/lpa-questionnaire.repository.js';

const lpaQuestionnaireActionsService = {
	async sendLpaQuestionnaire(appealId) {
		logger.info(`Sending LPA questionnaire to AppealID ${appealId}`);
		await lpaQuestionnaireRepository.createNewLpaQuestionnaire(appealId);
		logger.info('Sent LPA questionnaire');
	}
};

export default lpaQuestionnaireActionsService;
