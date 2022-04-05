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
	appellantName: 'Lee Thornton',
	address: {
		addressLine1: '96 The Avenue',
		town: 'Maidstone',
		county: 'Kent',
		postcode: 'MD21 5XY'
	}
};
const appeal_2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	status: 'awaiting_validation_info',
	createdAt: new Date(2022, 1, 25),
	addressId: 2,
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	}
};

const findManyStub = sinon.stub().returns([appeal_1, appeal_2]);

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: findManyStub
			}
		};
	}
}

test('gets all appeals assigned to inspector', async (t) => {
	sinon.stub(DatabaseFactory, 'getInstance').callsFake((arguments_) => new MockDatabaseClass(arguments_));

	const resp = await request.get('/inspector').set('userId', 1);

	t.is(resp.status, 200);
	t.deepEqual(resp.body, [
		{
			address: {
				addressLine1: '96 The Avenue',
				county: 'Kent',
				postcode: 'MD21 5XY',
				town: 'Maidstone',
			},
			addressId: 1,
			appellantName: 'Lee Thornton',
			createdAt: '2022-02-23T00:00:00.000Z',
			id: 1,
			localPlanningDepartment: 'Maidstone Borough Council',
			planningApplicationReference: '48269/APP/2021/1482',
			reference: 'APP/Q9999/D/21/1345264',
			status: 'received_appeal',
		},
		{
			address: {
				addressLine1: '55 Butcher Street',
				postcode: 'S63 0RB',
				town: 'Thurnscoe',
			},
			addressId: 2,
			createdAt: '2022-02-25T00:00:00.000Z',
			id: 2,
			reference: 'APP/Q9999/D/21/5463281',
			status: 'awaiting_validation_info',
		},
	]);
	sinon.assert.calledWith(findManyStub, {
		where: {
			status: {
				in: [
					'site_visit_not_yet_booked',
					'site_visit_booked',
					'decision_due'
				]
			},
			userId: 1
		}
	});
});
