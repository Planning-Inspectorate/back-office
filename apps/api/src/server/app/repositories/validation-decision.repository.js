import DatabaseFactory from './database.js';

const validationDecisionRepository = (function () {
	/**
	 * @returns {object} connection to database
	 */
	function getPool() {
		return DatabaseFactory.getInstance().pool;
	}

	return {
		addNewDecision(appealId, decision, reason, descriptionOfDevelopment) {
			return getPool().validationDecision.create({
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
