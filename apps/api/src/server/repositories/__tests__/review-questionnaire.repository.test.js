import test from 'ava';
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

test.before('sets up Database connection mock', () => {
	sinon.stub(databaseConnector, 'reviewQuestionnaire').get(() => {
		return { create: addReview };
	});
});

test('adds new review decision', async (t) => {
	const review = await newReviewRepository.addReview(1, false, {
		applicationPlansToReachDecisionMissingOrIncorrect: true,
		applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
	});

	t.deepEqual(review, newReview);
	sinon.assert.calledWith(addReview, {
		data: {
			appealId: 1,
			complete: false,
			applicationPlansToReachDecisionMissingOrIncorrect: true,
			applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
		}
	});
});
