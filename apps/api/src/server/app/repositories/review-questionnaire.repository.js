import DatabaseFactory from './database.js';

const newReviewRepository = (function() {
	/**
    * @returns {object} connection to database
    */
	function getPool () {
		return DatabaseFactory.getInstance().pool;
	}

	return {
		addReview: function(appealId, complete, reason, description) {
			return getPool().reviewQuestionnaire.create({
				data: {
					appealId: appealId,
					complete: complete,
					...reason,
					...description
				}
			});
		},
	};
})();

export default newReviewRepository;
