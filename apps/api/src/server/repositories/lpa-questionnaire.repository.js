import { databaseConnector } from '../utils/database-connector.js';

const lpaQuestionnaireRepository = (function () {
	return {
		createNewLpaQuestionnaire(appealId) {
			return databaseConnector.lPAQuestionnaire.create({
				data: {
					appeal: {
						connect: {
							id: appealId
						}
					}
				}
			});
		},
		updateById(id, data) {
			return databaseConnector.lPAQuestionnaire.update({
				where: { id },
				data
			});
		}
	};
}());

export default lpaQuestionnaireRepository;
