import { databaseConnector } from '../utils/database-connector.js';

const newReviewRepository = (function () {
	return {
		addReview(appealId, complete, reason) {
			return databaseConnector.reviewQuestionnaire.create({
				data: {
					appealId,
					complete,
					...reason
				}
			});
		}
	};
}());

export default newReviewRepository;
