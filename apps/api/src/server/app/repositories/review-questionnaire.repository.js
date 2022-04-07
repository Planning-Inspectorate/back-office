import DatabaseFactory from './database.js';

const newReviewRepository = (function() {
	/**
	 * Retun the connection pool of database connections
	 * TODO: This should be a utility function part of the main db lib.
	 *
	 * @returns {object} connection to database
	 */
	function getPool () {
		return DatabaseFactory.getInstance().pool;
	}

	return {
		addReview: function(appealId, complete, reason) {
			return getPool().reviewQuestionnaire.create({
				data: {
					appealId: appealId,
					complete: complete,
					...reason
				}
			});
		},
	};
})();

export default newReviewRepository;
