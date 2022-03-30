import DatabaseFactory from './database.js';

const lpaQuestionnaireRepository = (function() {
	/**
	 * @returns {object} connection to database
	 */
	function getPool () {
		return DatabaseFactory.getInstance().pool;
	}
  
	return {
		createNewLpaQuestionnaire: function(appealId) {
			return getPool().lPAQuestionnaire.create({
				data: {
					appeal: { connect: {
						id: appealId
					} }
				}
			});
		},
		updateById: function(id, data) {
			return getPool().lPAQuestionnaire.update({
				where: { id: id },
				data: data
			});
		}
	};
})();

export default lpaQuestionnaireRepository;
