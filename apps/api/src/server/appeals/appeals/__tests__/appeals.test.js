import supertest from 'supertest';
import { app } from '../../../app-test.js';
import {
	ERROR_FAILED_TO_SAVE_DATA,
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_GREATER_THAN_ZERO,
	ERROR_MUST_BE_NUMBER,
	ERROR_NOT_FOUND,
	ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
} from '../../constants.js';

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
					pageNumber: ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
				}
			});
		});

		test('returns an error if pageSize is given and pageNumber is not given', async () => {
			const response = await request.get('/appeals?pageSize=1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageSize: ERROR_PAGENUMBER_AND_PAGESIZE_ARE_REQUIRED
				}
			});
		});

		test('returns an error if pageNumber is not numeric', async () => {
			const response = await request.get('/appeals?pageNumber=one&pageSize=1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageNumber: ERROR_MUST_BE_NUMBER
				}
			});
		});

		test('returns an error if pageNumber is less than 1', async () => {
			const response = await request.get('/appeals?pageNumber=-1&pageSize=1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageNumber: ERROR_MUST_BE_GREATER_THAN_ZERO
				}
			});
		});

		test('returns an error if pageSize is not numeric', async () => {
			const response = await request.get('/appeals?pageNumber=1&pageSize=one');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageSize: ERROR_MUST_BE_NUMBER
				}
			});
		});

		test('returns an error if pageSize is less than 1', async () => {
			const response = await request.get('/appeals?pageNumber=1&pageSize=-1');

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					pageSize: ERROR_MUST_BE_GREATER_THAN_ZERO
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
					appealId: ERROR_MUST_BE_NUMBER
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
					appealId: ERROR_NOT_FOUND
				}
			});
		});

		test('updates an appeal', async () => {
			const response = await request.patch(`/appeals/${appeal.id}`).send({
				startedAt: '2023-05-05'
			});

			expect(databaseConnector.appeal.update).toBeCalledWith({
				data: {
					startedAt: '2023-05-05T00:00:00.000Z',
					updatedAt: expect.any(Date)
				},
				where: {
					id: appeal.id
				}
			});
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				startedAt: '2023-05-05T00:00:00.000Z'
			});
		});

		test('returns an error if startedAt is not in the correct format', async () => {
			const response = await request.patch(`/appeals/${appeal.id}`).send({
				startedAt: '05/05/2023'
			});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
				}
			});
		});

		test('returns an error if startedAt does not contain leading zeros', async () => {
			const response = await request.patch(`/appeals/${appeal.id}`).send({
				startedAt: '2023-5-5'
			});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
				}
			});
		});

		test('returns an error if startedAt is not a valid date', async () => {
			const response = await request.patch(`/appeals/${appeal.id}`).send({
				startedAt: '2023-02-30'
			});

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					startedAt: ERROR_MUST_BE_CORRECT_DATE_FORMAT
				}
			});
		});

		test('returns an error if given an incorrect field name', async () => {
			// @ts-ignore
			databaseConnector.appeal.update.mockImplementation(() => {
				throw new Error(ERROR_FAILED_TO_SAVE_DATA);
			});

			const response = await request.patch(`/appeals/${appeal.id}`).send({
				startedAtDate: '2023-02-10'
			});

			expect(response.status).toEqual(500);
			expect(response.body).toEqual({
				errors: {
					body: ERROR_FAILED_TO_SAVE_DATA
				}
			});
		});

		test('does not throw an error if given an empty body', async () => {
			// @ts-ignore
			databaseConnector.appeal.update.mockResolvedValue(true);

			const response = await request.patch(`/appeals/${appeal.id}`).send({});

			expect(response.status).toEqual(200);
			expect(response.body).toEqual({});
		});
	});
});
