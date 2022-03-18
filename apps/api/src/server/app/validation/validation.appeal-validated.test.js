// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const appeal_1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'received_appeal',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton'
};
const updated_appeal_1 = {
	id: 1,
	reference: 'REFERENCE',
	apellantName: 'some name',
	status: 'new status',
	createdAt: new Date(2022, 3, 15),
	addressId: 1
};

const getAppealByIdStub = sinon.stub();
const updateStub = sinon.stub();

getAppealByIdStub.withArgs({ where: { id: 1 } }).returns(appeal_1);
updateStub.returns(updated_appeal_1);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findUnique: getAppealByIdStub,
				update: updateStub
			}
		};
	}
}

test.before('sets up mocking of database', () => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));
});

test('should submit validation decision', async (t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'valid' });
	t.is(resp.status, 200);
	sinon.assert.calledOnceWithExactly(updateStub, { where: { id: 1 }, data: { status: 'with_case_officer' } });
});
