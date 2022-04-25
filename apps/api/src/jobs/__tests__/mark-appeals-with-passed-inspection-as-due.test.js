// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import sinon from 'sinon';
import findAndUpdateStatusForAppealsWithPassedInspection from '../mark-appeals-with-passed-inspection-as-due.js';
import DatabaseFactory from '../../server/app/repositories/database.js';

const appeal_1 = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	appealStatus: [{
		id: 1,
		status: 'site_visit_booked',
		valid: true
	}],
	appealType: {
		type: 'household'
	},
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};

const updateStub = sinon.stub();
updateStub.returns(appeal_1);

const findManyStub = sinon.stub();
findManyStub.returns([appeal_1]);
const updateManyAppealStatusStub = sinon.stub();
const createAppealStatusStub = sinon.stub();

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				update: updateStub,
				findMany: findManyStub
			},
			appealStatus: {
				updateMany: updateManyAppealStatusStub,
				create: createAppealStatusStub
			},
			$transaction: sinon.stub()
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
			appealStatus: {
				every: {
					status: 'site_visit_booked',
					valid: true
				}
			},
			siteVisit: {
				visitDate: {
					lt: sinon.match.any
				}
			}
		}
	});
	sinon.assert.calledWith(updateManyAppealStatusStub, { where: { id: { in: [1] } }, data: { valid: false } });
	sinon.assert.calledWith(createAppealStatusStub, { data: { status: 'decision_due', appealId: 1 } });
});
