import sinon from 'sinon';
import { databaseConnector } from '../../utils/database-connector.js';
import newReviewRepository from '../review-questionnaire.repository.js';

const addReview = sinon.stub();

const newReview = {
	appealId: 1,
	complete: false,
	applicationPlansToReachDecisionMissingOrIncorrect: true,
	applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
};

addReview.returns(newReview);

describe('Review questionnaire repository', () => {
	beforeAll(() => {
		sinon.stub(databaseConnector, 'reviewQuestionnaire').get(() => {
			return { create: addReview };
		});
	});

	test('adds new review decision', async () => {
		const review = await newReviewRepository.addReview(1, false, {
			applicationPlansToReachDecisionMissingOrIncorrect: true,
			applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
		});

		expect(review).toEqual(newReview);
		sinon.assert.calledWith(addReview, {
			data: {
				appealId: 1,
				complete: false,
				applicationPlansToReachDecisionMissingOrIncorrect: true,
				applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
			}
		});
	});
});
