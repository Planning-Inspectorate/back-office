// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import sinon from 'sinon';
import findAndUpdateStatusForAppealsWithPassedInspection from './mark-appeals-with-passed-inspection-as-due.js';
import DatabaseFactory from '../server/app/repositories/database.js';

const appeal_1 = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	appealStatus: [{
		status: 'site_visit_booked',
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
	await findAndUpdateStatusForAppealsWithPassedInspection();
	// This is needed because otherwise AVA complains that there are no assertions in the test :(
	t.is(true, true);
	sinon.assert.calledOnceWithExactly(findManyStub, {
		where: {
			status: 'site_visit_booked',
			siteVisit: {
				visitDate: {
					lt: sinon.match.any
				}
			}
		}
	});
	sinon.assert.calledOnceWithExactly(updateStub, { 
		where: { id: 1 }, 
		data: { status: 'decision_due', statusUpdatedAt: sinon.match.any, updatedAt: sinon.match.any }
	});
});
