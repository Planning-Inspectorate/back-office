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
const appeal_2 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'valid_appeal',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton'
};
const appeal_3 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'invalid_appeal',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton'
};
const appeal_4 = {
	id: 4,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'awaiting_validation_info',
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
getAppealByIdStub.withArgs({ where: { id: 2 } }).returns(appeal_2);
getAppealByIdStub.withArgs({ where: { id: 3 } }).returns(appeal_3);
getAppealByIdStub.withArgs({ where: { id: 4 } }).returns(appeal_4);

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

test('should be able to submit \'valid\' decision', async (t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'valid' });
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, { where: { id: 1 }, data: { status: 'with_case_officer' } });
});

test('should be able to submit \'invalid\' decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'invalid' });
	t.is(resp.status, 200);
	// TODO: calledOneWithExactly throws error
	sinon.assert.calledWithExactly(updateStub, { where: { id: 1 }, data: { status: 'invalid_appeal' } });
});

test('should be able to submit \'missing appeal details\' decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'info missing' });
	t.is(resp.status, 200);
	// TODO: calledOneWithExactly throws error
	sinon.assert.calledWithExactly(updateStub, { where: { id: 1 }, data: { status: 'awaiting_validation_info' } });
});

test('should not be able to submit nonsensical decision decision', async(t) => {
	const resp = await request.post('/validation/1')
		.send({ AppealStatus: 'some unknown status' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Unknown AppealStatus' } );
});

test('should not be able to submit validation decision for appeal that has been marked \'valid\'', async(t) => {
	const resp = await request.post('/validation/2')
		.send({ AppealStatus: 'some unknown status' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Appeal does not require validation' } );
});

test('should not be able to submit validation decision for appeal that has been marked \'invalid\'', async(t) => {
	const resp = await request.post('/validation/3')
		.send({ AppealStatus: 'some unknown status' });
	t.is(resp.status, 400);
	t.deepEqual(resp.body, { error: 'Appeal does not require validation' } );
});

test('should be able to mark appeal with missing info as \'valid\'', async(t) => {
	const resp = await request.post('/validation/4').send({ AppealStatus: 'valid' });
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, { where: { id: 4 }, data: { status: 'with_case_officer' } });
});

test('should be able to mark appeak with missing info as \'invalid\'', async(t) => {
	const resp = await request.post('/validation/4').send({ AppealStatus: 'invalid' });
	t.is(resp.status, 200);
	sinon.assert.calledWithExactly(updateStub, { where: { id: 4 }, data: { status: 'invalid_appeal' } });
});
