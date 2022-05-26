import test from 'ava';
import sinon from 'sinon';
import DatabaseFactory from '../../server/app/repositories/database.js';
import { appealFactoryForTests } from '../../server/app/utils/appeal-factory-for-tests.js';
import findAndUpdateStatusForAppealsWithPassedInspection from '../mark-appeals-with-passed-inspection-as-due.js';

const appeal1 = appealFactoryForTests(
	1,
	[
		{
			id: 1,
			status: 'site_visit_booked',
			valid: true
		}
	],
	'HAS'
);

const updateStub = sinon.stub();

updateStub.returns(appeal1);

const findManyStub = sinon.stub();

findManyStub.returns([appeal1]);

const updateManyAppealStatusStub = sinon.stub();
const createAppealStatusStub = sinon.stub();

class MockDatabaseClass {
	constructor() {
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
	sinon
		.stub(DatabaseFactory, 'getInstance')
		.callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('finds appeals to mark as overdue as updates their statuses', async (t) => {
	await findAndUpdateStatusForAppealsWithPassedInspection();
	// This is needed because otherwise AVA complains that there are no assertions in the test :(
	t.is(true, true);
	sinon.assert.calledOnceWithExactly(findManyStub, {
		where: {
			appealStatus: {
				some: {
					status: 'site_visit_booked',
					valid: true
				}
			},
			siteVisit: {
				visitDate: {
					lt: sinon.match.any
				}
			}
		},
		include: {
			appealType: true
		}
	});
	sinon.assert.calledWith(updateManyAppealStatusStub, {
		where: { id: { in: [1] } },
		data: { valid: false }
	});
	sinon.assert.calledWith(createAppealStatusStub, {
		data: { status: 'decision_due', appealId: 1 }
	});
});
