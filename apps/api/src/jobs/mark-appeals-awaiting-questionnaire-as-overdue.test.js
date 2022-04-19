// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import sinon from 'sinon';
import findAndUpdateStatusForAppealsWithOverdueQuestionnaires from './mark-appeals-awaiting-questionnaire-as-overdue.js';
import DatabaseFactory from '../server/app/repositories/database.js';

const appeal_1 = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	appealStatus: [{
		status: 'awaiting_lpa_questionnaire',
		valid: true
	}],
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};

const updateStub = sinon.stub();
updateStub.returns(appeal_1);

const findManyStub = sinon.stub();
findManyStub.returns([appeal_1]);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				update: updateStub,
				findMany: findManyStub
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('finds appeals to mark as overdue as updates their statuses', async(t) => {
	await findAndUpdateStatusForAppealsWithOverdueQuestionnaires();
	// This is needed because otherwise AVA complains that there are no assertions in the test :(
	t.is(true, true);
	sinon.assert.calledOnceWithExactly(findManyStub, {
		where: {
			status: 'awaiting_lpa_questionnaire',
			statusUpdatedAt: {
				lt: sinon.match.any
			}
		}
	});
	sinon.assert.calledOnceWithExactly(updateStub, { 
		where: { id: 1 }, 
		data: { status: 'overdue_lpa_questionnaire', statusUpdatedAt: sinon.match.any, updatedAt: sinon.match.any }
	});
});
