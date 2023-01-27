import sinon from 'sinon';
import supertest from 'supertest';
import { app } from '../../../app.js';
import { databaseConnector } from '../../../utils/database-connector.js';

const request = supertest(app);

const appeal1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [
		{
			status: 'received_appeal',
			valid: true
		}
	],
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
const appeal2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [
		{
			status: 'awaiting_validation_info',
			valid: true
		}
	],
	createdAt: new Date(2022, 1, 25),
	addressId: 2,
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	}
};

describe('Get appeals', () => {
	test('gets all new and incomplete validation appeals', async () => {
		sinon.stub(databaseConnector, 'appeal').get(() => {
			return { findMany: sinon.stub().returns([appeal1, appeal2]) };
		});

		const resp = await request.get('/appeals/validation');

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

		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual([validationLineNew, validationLineIncomplete]);
	});
});
