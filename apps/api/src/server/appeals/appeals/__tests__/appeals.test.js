import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [
		{
			status: 'awaiting_lpa_questionnaire',
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
	startedAt: new Date(2022, 4, 18),
	address: {
		addressLine1: '96 The Avenue',
		town: 'Maidstone',
		county: 'Kent',
		postcode: 'MD21 5XY'
	},
	appealType: {
		id: 2,
		type: 'household',
		shorthand: 'HAS'
	}
};

const appealResponse = [
	{
		appealId: 1,
		appealReference: 'APP/Q9999/D/21/1345264',
		appealSite: {
			addressLine1: '96 The Avenue',
			town: 'Maidstone',
			county: 'Kent',
			postCode: 'MD21 5XY'
		},
		appealStatus: 'awaiting_lpa_questionnaire',
		appealType: 'household',
		createdAt: new Date(2022, 1, 23).toISOString(),
		localPlanningDepartment: 'Maidstone Borough Council'
	}
];

describe('Appeals', () => {
	test('gets all appeals', async () => {
		databaseConnector.appeal.findMany.mockResolvedValue([appeal]);

		const response = await request.get('/appeals');

		expect(response.status).toEqual(200);
		expect(response.body).toEqual(appealResponse);
	});
});
