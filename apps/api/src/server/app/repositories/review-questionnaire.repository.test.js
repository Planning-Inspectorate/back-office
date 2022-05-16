import test from 'ava';
import sinon from 'sinon';
import DatabaseFactory from './database.js';
import newReviewRepository from './review-questionnaire.repository.js';

const addReview = sinon.stub();

const newReview = {
	appealId: 1,
	complete: false,
	applicationPlansToReachDecisionMissingOrIncorrect: true,
	applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description'
};

addReview.returns(newReview);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			reviewQuestionnaire: {
				create: addReview
			}
		};
	}
}

test.before('sets up Database connection mock', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('adds new review decision', async(t) => {
	const review = await newReviewRepository.addReview(
		1,
		false,
		{ applicationPlansToReachDecisionMissingOrIncorrect: true,
			applicationPlansToReachDecisionMissingOrIncorrectDescription: 'Some description' });

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
