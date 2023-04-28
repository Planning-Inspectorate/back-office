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
	siteVisit: {
		visitType: 'unaccompanied'
	},
	inspectorDecision: {
		outcome: 'Not issued yet'
	}
};

describe('Appeals', () => {
	describe('/appeals', () => {
		test('get all appeals', async () => {
			// @ts-ignore
			databaseConnector.appeal.findMany.mockResolvedValue([appeal]);

			const response = await request.get('/appeals');

			expect(response.status).toEqual(200);
			expect(response.body).toEqual([
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
				}
			]);
		});
	});

	describe('/appeals/:appealId', () => {
		test('get a single appeal', async () => {
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
				developmentType: 'Minor Dwellings',
				eventType: 'Site Visit',
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
				visitType: appeal.siteVisit.visitType
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
