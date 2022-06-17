import { databaseConnector } from '../utils/database-connector.js';

const validationDecisionRepository = (function () {
	return {
		addNewDecision(appealId, decision, reason, descriptionOfDevelopment) {
			return databaseConnector.validationDecision.create({
				data: {
					appealId,
					decision,
					descriptionOfDevelopment,
					...reason
				}
			});
		}
	};
}());

export default validationDecisionRepository;
