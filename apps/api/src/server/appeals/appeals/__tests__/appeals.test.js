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
		name: 'Lee Thornton',
		agentName: null
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
	},
	appealDetailsFromAppellant: {
		appellantOwnsWholeSite: true,
		siteVisibleFromPublicLand: true,
		healthAndSafetyIssues: false
	},
	inspectorDecision: {
		outcome: 'Not issued yet'
	}
};
const appealTwo = {
	...appeal,
	id: 2
};

describe('Appeals', () => {
	describe('/appeals', () => {
		test('gets appeals when not given pagination params', async () => {
			// @ts-ignore
			databaseConnector.appeal.count.mockResolvedValue(5);
			// @ts-ignore
			databaseConnector.appeal.findMany.mockResolvedValue([appeal, appealTwo]);

			const response = await request.get('/appeals');

			expect(databaseConnector.appeal.findMany).toBeCalledWith(
				expect.objectContaining({
					skip: 0,
					take: 30
				})
			);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				itemCount: 5,
				items: [
					{
						appealId: appeal.id,
						appealReference: appeal.reference,
						appealSite: {
							addressLine1: appeal.address.addressLine1,
							town: appeal.address.town,
							county: appeal.address.county,
							postCode: appeal.address.postcode
						},
						appealStatus: appeal.appealStatus[0].status,
						appealType: appeal.appealType.type,
						createdAt: appeal.createdAt.toISOString(),
						localPlanningDepartment: appeal.localPlanningDepartment
					},
					{
						appealId: appealTwo.id,
						appealReference: appeal.reference,
						appealSite: {
							addressLine1: appeal.address.addressLine1,
							town: appeal.address.town,
							county: appeal.address.county,
							postCode: appeal.address.postcode
						},
						appealStatus: appeal.appealStatus[0].status,
						appealType: appeal.appealType.type,
						createdAt: appeal.createdAt.toISOString(),
						localPlanningDepartment: appeal.localPlanningDepartment
					}
				],
				page: 1,
				pageCount: 1,
				pageSize: 30
			});
		});

		test('gets appeals when given pagination params', async () => {
			// @ts-ignore
			databaseConnector.appeal.count.mockResolvedValue(5);
			// @ts-ignore
			databaseConnector.appeal.findMany.mockResolvedValue([appealTwo]);

			const response = await request.get('/appeals?pageNumber=2&pageSize=1');

			expect(databaseConnector.appeal.findMany).toBeCalledWith(
				expect.objectContaining({
					skip: 1,
					take: 1
				})
			);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				itemCount: 5,
				items: [
					{
						appealId: appealTwo.id,
						appealReference: appeal.reference,
						appealSite: {
							addressLine1: appeal.address.addressLine1,
							town: appeal.address.town,
							county: appeal.address.county,
							postCode: appeal.address.postcode
						},
						appealStatus: appeal.appealStatus[0].status,
						appealType: appeal.appealType.type,
						createdAt: appeal.createdAt.toISOString(),
						localPlanningDepartment: appeal.localPlanningDepartment
					}
				],
				page: 2,
				pageCount: 5,
				pageSize: 1
			});
		});

		test('returns an error if pageNumber is given and pageSize is not given', async () => {
			const response = await request.get('/appeals?pageNumber=1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageNumber: 'Both pageNumber and pageSize are required for pagination'
				}
			});
		});

		test('returns an error if pageSize is given and pageNumber is not given', async () => {
			const response = await request.get('/appeals?pageSize=1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageSize: 'Both pageNumber and pageSize are required for pagination'
				}
			});
		});

		test('returns an error if pageNumber is not numeric', async () => {
			const response = await request.get('/appeals?pageNumber=one&pageSize=1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageNumber: 'Must be a number'
				}
			});
		});

		test('returns an error if pageNumber is less than 1', async () => {
			const response = await request.get('/appeals?pageNumber=-1&pageSize=1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageNumber: 'Must be greater than 0'
				}
			});
		});

		test('returns an error if pageSize is not numeric', async () => {
			const response = await request.get('/appeals?pageNumber=1&pageSize=one');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageSize: 'Must be a number'
				}
			});
		});

		test('returns an error if pageSize is less than 1', async () => {
			const response = await request.get('/appeals?pageNumber=1&pageSize=-1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageSize: 'Must be greater than 0'
				}
			});
		});
	});

	describe('/appeals/:appealId', () => {
		test('gets a single appeal', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appeal);

			const response = await request.get(`/appeals/${appeal.id}`);

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				agentName: appeal.appellant.agentName,
				allocationDetails: 'F / General Allocation',
				appealId: appeal.id,
				appealReference: appeal.reference,
				appealSite: {
					addressLine1: appeal.address.addressLine1,
					town: appeal.address.town,
					county: appeal.address.county,
					postCode: appeal.address.postcode
				},
				appealStatus: appeal.appealStatus[0].status,
				appealType: appeal.appealType.type,
				appellantName: appeal.appellant.name,
				caseProcedure: 'Written',
				decision: appeal.inspectorDecision.outcome,
				linkedAppeal: {
					appealId: 1,
					appealReference: 'APP/Q9999/D/21/725284'
				},
				localPlanningDepartment: appeal.localPlanningDepartment,
				otherAppeals: [
					{
						appealId: 1,
						appealReference: 'APP/Q9999/D/21/725284'
					}
				],
				planningApplicationReference: appeal.planningApplicationReference,
				startedAt: appeal.startedAt.toISOString()
			});
		});

		test('returns an error if appealId is not numeric', async () => {
			const response = await request.get('/appeals/one');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					appealId: 'Appeal id must be a number'
				}
			});
		});

		test('returns an error if an appeal is not found', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(null);

			const response = await request.get(`/appeals/${appeal.id}`);

			expect(response.status).toEqual(404);
			expect(response.body).toEqual({
				errors: {
					appealId: `Appeal with id ${appeal.id} not found`
				}
			});
		});
	});
});
