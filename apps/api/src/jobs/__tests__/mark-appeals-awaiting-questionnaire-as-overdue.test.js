// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import sinon from 'sinon';
import findAndUpdateStatusForAppealsWithOverdueQuestionnaires from '../mark-appeals-awaiting-questionnaire-as-overdue.js';
import DatabaseFactory from '../../server/app/repositories/database.js';
import appealRepository from '../../server/app/repositories/appeal.repository.js';

const appeal_1 = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	appealStatus: [{
		id: 1,
		status: 'awaiting_lpa_questionnaire',
		valid: true
	}],
	appealType: {
		type: 'household'
	},
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};

const appeal_2 = {
	id: 2,
	reference: 'REFERENCE',
	apellantName: 'some name',
	appealStatus: [{
		id: 21,
		status: 'awaiting_lpa_questionnaire',
		subStateMachineName: 'lpaQuestionnaireAndInspectorPickup',
		compoundStateName: 'awaiting_lpa_questionnaire_and_statements',
		valid: true
	}, {
		id: 22,
		status: 'available_for_statements',
		valid: true,
		subStateMachineName: 'statementsAndFinalComments',
		compoundStateName: 'awaiting_lpa_questionnaire_and_statements'
	}],
	appealType: {
		type: 'full planning'
	},
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};

const updateStub = sinon.stub();
updateStub.returns(appeal_1);

const findManyStub = sinon.stub();
findManyStub.returns([appeal_1, appeal_2]);

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
				create: createAppealStatusStub,
				createMany: sinon.stub()
			},
			$transaction: sinon.stub()
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
			appealStatus: {
				some: {
					status: 'awaiting_lpa_questionnaire',
					valid: true,
					createdAt: {
						lt: sinon.match.any
					}
				}
			}
		},
		include: {
			appealType: true,
			appealStatus: {
				where: {
					valid: true
				}
			}
		}
	});
	sinon.assert.calledWith(updateManyAppealStatusStub, { where: { id: { in: [1] } }, data: { valid: false } });
	sinon.assert.calledWith(createAppealStatusStub, { data: { status: 'overdue_lpa_questionnaire', appealId: 1 } });
});
