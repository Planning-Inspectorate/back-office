const { databaseConnector } = await import('../../utils/database-connector.js');

import newReviewRepository from '../review-questionnaire.repository.js';

const newReview = {
	appealId: 1,
	complete: false,
	applicationPlansToReachDecisionMissingOrIncorrect: true,
	applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
};

describe('Review questionnaire repository', () => {
	test('adds new review decision', async () => {
		// GIVEN
		databaseConnector.reviewQuestionnaire.create.mockResolvedValue(newReview);

		// WHEN
		const review = await newReviewRepository.addReview(1, false, {
			applicationPlansToReachDecisionMissingOrIncorrect: true,
			applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
		});

		// THEN
		expect(review).toEqual(newReview);
		expect(databaseConnector.reviewQuestionnaire.create).toHaveBeenCalledWith({
			data: {
				appealId: 1,
				complete: false,
				applicationPlansToReachDecisionMissingOrIncorrect: true,
				applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
			}
		});
	});
});
