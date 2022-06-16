import lpaQuestionnaireRepository from '../../repositories/lpa-questionnaire.repository.js';
import logger from '../../utils/logger.js';

const lpaQuestionnaireActionsService = {
	async sendLpaQuestionnaire(appealId) {
		logger.info(`Sending LPA questionnaire to AppealID ${appealId}`);
		await lpaQuestionnaireRepository.createNewLpaQuestionnaire(appealId);
		logger.info('Sent LPA questionnaire');
	}
};

export default lpaQuestionnaireActionsService;
