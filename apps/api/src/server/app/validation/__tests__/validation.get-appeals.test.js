// eslint-disable-next-line import/no-unresolved
import test from 'ava';
import supertest from 'supertest';
import sinon from 'sinon';
import { app } from '../../../app.js';
import DatabaseFactory from '../../repositories/database.js';

const request = supertest(app);

const appeal_1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	status: 'received_appeal',
	createdAt: new Date(2022, 1, 23),
	addressId: 1,
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	},
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

class MockDatabaseClass {
	constructor(_parameters) {
		this.pool = {
			appeal: {
				findMany: sinon.stub().returns([appeal_1, appeal_2])
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
		AppealSite: {
			AddressLine1: '96 The Avenue', 
			Town: 'Maidstone',
			County: 'Kent',
			PostCode: 'MD21 5XY'
		}
	};
	const validationLineIncomplete = {
		AppealId: 2,
		AppealReference: 'APP/Q9999/D/21/5463281',
		AppealStatus: 'incomplete',
		Received: '25 Feb 2022',
		AppealSite: {
			AddressLine1: '55 Butcher Street', 
			Town: 'Thurnscoe', 
			PostCode: 'S63 0RB'
		}
	};
	t.is(resp.status, 200);
	t.deepEqual(resp.body, [validationLineNew, validationLineIncomplete]);
});
