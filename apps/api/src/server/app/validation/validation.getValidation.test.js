import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../app.js';
import DatabaseFactory from '../repositories/database.js';

const request = supertest(app);

const getAddressByIdStub = sinon.stub();
getAddressByIdStub.withArgs({ where: { id: 1 } }).returns({
	id: 1,
	addressLine1: '96 The Avenue',
	addressLine2: 'Maidstone',
	postcode: 'MD21 5XY',
	city: 'Kent'
});
getAddressByIdStub.withArgs({ where: { id: 2 } }).returns({
	id: 2,
	addressLine1: '55 Butcher Street',
	postcode: 'S63 0RB',
	city: 'Thurnscoe'
});

const appeal_1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'submitted',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellantName: 'Lee Thornton'
};
const appeal_2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'awaiting_validation_info',
	createdAt: new Date(2022, 1, 25),
	addressId: 2
};
const appeal_3 = {
	id: 3,
	status: 'invalid'
};
const getAppealByIdStub = sinon.stub();
getAppealByIdStub.withArgs({ where: { id: 1 } }).returns(appeal_1);
getAppealByIdStub.withArgs({ where: { id: 3 } }).returns(appeal_3);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: sinon.stub().returns([appeal_1, appeal_2]),
				findUnique: getAppealByIdStub
			},
			address: {
				findUnique: getAddressByIdStub
			}
		};
	}
}

test('gets all new and incomplete validation appeals', async (t) => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));

	const resp = await request.get('/validation');

	const validationLineNew = {
		AppealId: 1,
		AppealReference: 'APP/Q9999/D/21/1345264',
		AppealStatus: 'new',
		Received: '23 Feb 2022',
		AppealSite: '96 The Avenue, Maidstone, Kent, MD21 5XY'
	};
	const validationLineIncomplete = {
		AppealId: 2,
		AppealReference: 'APP/Q9999/D/21/5463281',
		AppealStatus: 'incomplete',
		Received: '25 Feb 2022',
		AppealSite: '55 Butcher Street, Thurnscoe, S63 0RB'
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, [validationLineNew, validationLineIncomplete]);
});
