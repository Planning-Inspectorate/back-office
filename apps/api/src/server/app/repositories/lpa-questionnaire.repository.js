import DatabaseFactory from './database.js';

const lpaQuestionnaireRepository = (function () {
	/**
	 * @returns {object} connection to database
	 */
	function getPool() {
		return DatabaseFactory.getInstance().pool;
	}

	return {
		createNewLpaQuestionnaire(appealId) {
			return getPool().lPAQuestionnaire.create({
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
			return getPool().lPAQuestionnaire.update({
				where: { id },
				data
			});
		}
	};
}());

export default lpaQuestionnaireRepository;
