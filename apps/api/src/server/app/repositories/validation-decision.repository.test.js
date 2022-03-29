// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import validationDecisionRepository from './validation-decision.repository.js';
import sinon from 'sinon';
import DatabaseFactory from './database.js';

const addNewDecision = sinon.stub();

const newDecision = {
	appealId: 1,
	decision: 'incomplete',
	descriptionOfDevelopment: undefined,
	namesDoNotMatch: true
};

addNewDecision.returns(newDecision);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			validationDecision: {
				create: addNewDecision
			}
		};
	}
}

test.before('sets up Database connection mock', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('adds new Validation decision', async(t) => {
	const decision = await validationDecisionRepository.addNewDecision(1, 'incomplete',  { 	namesDoNotMatch: true });
	t.deepEqual(decision, newDecision);
	sinon.assert.calledWith(addNewDecision, {
		data: {
			appealId: 1,
			decision: 'incomplete',
			descriptionOfDevelopment: undefined,
			namesDoNotMatch: true
		}
	});
});
