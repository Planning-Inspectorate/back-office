import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal1 = {
	id: 1,
	reference: 'APP/Q9999/D/21/1345264',
	appealStatus: [
		{
			status: 'decision_due',
			valid: true
		}
	],
	appealType: {
		shorthand: 'HAS'
	},
	createdAt: new Date(2022, 1, 23),
	localPlanningDepartment: 'Maidstone Borough Council',
	planningApplicationReference: '48269/APP/2021/1482',
	appellant: {
		name: 'Lee Thornton'
	},
	startedAt: new Date(2022, 1, 25),
	address: {
		addressLine1: '96 The Avenue',
		town: 'Maidstone',
		county: 'Kent',
		postcode: 'MD21 5XY'
	},
	siteVisit: {
		visitDate: new Date(2021, 10, 2),
		visitSlot: '1pm - 2pm',
		visitType: 'unaccompanied'
	},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: false
	}
};
const appeal2 = {
	id: 2,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [
		{
			status: 'site_visit_booked',
			valid: true
		}
	],
	appealType: {
		shorthand: 'HAS'
	},
	createdAt: new Date(2022, 1, 25),
	startedAt: new Date(2022, 3, 29),
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	siteVisit: {
		visitDate: new Date(2022, 0, 10),
		visitSlot: '10am - 11am',
		visitType: 'accompanied'
	},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: false
	}
};

const appeal3 = {
	id: 3,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [
		{
			status: 'site_visit_not_yet_booked',
			valid: true
		}
	],
	appealType: {
		shorthand: 'HAS'
	},
	createdAt: new Date(2022, 1, 25),
	startedAt: new Date(2022, 3, 29),
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	siteVisit: {},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: false
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true
	}
};

const appeal4 = {
	id: 4,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [
		{
			status: 'site_visit_not_yet_booked',
			valid: true
		}
	],
	appealType: {
		shorthand: 'FPA'
	},
	createdAt: new Date(2022, 1, 25),
	startedAt: new Date(2022, 3, 29),
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	siteVisit: {},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: true
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: false
	}
};

const appeal5 = {
	id: 5,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [
		{
			status: 'site_visit_not_yet_booked',
			valid: true
		}
	],
	appealType: {
		shorthand: 'FPA'
	},
	createdAt: new Date(2022, 1, 25),
	startedAt: new Date(2022, 3, 29),
	address: {
		addressLine1: '55 Butcher Street',
		town: 'Thurnscoe',
		postcode: 'S63 0RB'
	},
	siteVisit: {},
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: true
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true
	}
};

jest.useFakeTimers({ now: 1_649_319_144_000 });

describe('Get Appeals', () => {
	test('gets all appeals assigned to inspector', async () => {
		// GIVEN
		databaseConnector.appeal.findMany.mockResolvedValue([
			appeal1,
			appeal2,
			appeal3,
			appeal4,
			appeal5
		]);

		// WHEN
		const resp = await request.get('/appeals/inspector').set('userId', 1);

		// THEN
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual([
			{
				appealId: 1,
				reference: 'APP/Q9999/D/21/1345264',
				status: 'decision due',
				appealSite: {
					addressLine1: '96 The Avenue',
					county: 'Kent',
					postCode: 'MD21 5XY',
					town: 'Maidstone'
				},
				appealAge: 41,
				siteVisitType: 'unaccompanied',
				appealType: 'HAS',
				siteVisitDate: '02 Nov 2021',
				siteVisitSlot: '1pm - 2pm'
			},
			{
				appealId: 2,
				reference: 'APP/Q9999/D/21/5463281',
				status: 'booked',
				appealSite: {
					addressLine1: '55 Butcher Street',
					postCode: 'S63 0RB',
					town: 'Thurnscoe'
				},
				appealAge: 22,
				siteVisitType: 'accompanied',
				appealType: 'HAS',
				siteVisitDate: '10 Jan 2022',
				siteVisitSlot: '10am - 11am'
			},
			{
				appealAge: 22,
				appealId: 3,
				appealSite: {
					addressLine1: '55 Butcher Street',
					postCode: 'S63 0RB',
					town: 'Thurnscoe'
				},
				appealType: 'HAS',
				reference: 'APP/Q9999/D/21/5463281',
				status: 'not yet booked',
				provisionalVisitType: 'access required'
			},
			{
				appealAge: 22,
				appealId: 4,
				appealSite: {
					addressLine1: '55 Butcher Street',
					postCode: 'S63 0RB',
					town: 'Thurnscoe'
				},
				appealType: 'FPA',
				reference: 'APP/Q9999/D/21/5463281',
				status: 'not yet booked',
				provisionalVisitType: 'access required'
			},
			{
				appealAge: 22,
				appealId: 5,
				appealSite: {
					addressLine1: '55 Butcher Street',
					postCode: 'S63 0RB',
					town: 'Thurnscoe'
				},
				appealType: 'FPA',
				reference: 'APP/Q9999/D/21/5463281',
				status: 'not yet booked',
				provisionalVisitType: 'unaccompanied'
			}
		]);
		expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith({
			where: {
				appealStatus: {
					some: {
						status: {
							in: ['site_visit_not_yet_booked', 'site_visit_booked', 'decision_due', 'picked_up']
						},
						valid: true
					}
				},
				user: { azureReference: 1 }
			},
			include: {
				address: true,
				siteVisit: true,
				lpaQuestionnaire: true,
				appealDetailsFromAppellant: true,
				appellant: true,
				appealStatus: {
					where: {
						valid: true
					}
				},
				appealType: true
			}
		});
	});

	test('throws error if userid is not provided in the header', async () => {
		// GIVEN

		// WHEN
		const resp = await request.get('/appeals/inspector');

		// THEN
		expect(resp.status).toEqual(401);
		expect(resp.body).toEqual({
			errors: { userid: 'Authentication error. Missing header `userId`.' }
		});
	});
});
