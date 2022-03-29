import DatabaseFactory from './database.js';

const validationDecisionRepository = (function() {
	/**
    * @returns {object} connection to database
    */
	function getPool () {
		return DatabaseFactory.getInstance().pool;
	}

	return {
		addNewDecision: function(appealId, decision, reason) {
			return getPool().validationDecision.create({
				data: {
					appealId: appealId,
					decision: decision,
					...reason }
			});
		},
	};
})();

export default validationDecisionRepository;
