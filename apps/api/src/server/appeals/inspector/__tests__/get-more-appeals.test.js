import { jest } from '@jest/globals';
import supertest from 'supertest';
import { app } from '../../../app-test.js';
const { databaseConnector } = await import('../../../utils/database-connector.js');

const request = supertest(app);

const appeal25 = {
	id: 25,
	reference: 'APP/Q9999/D/21/5463281',
	appealStatus: [
		{
			status: 'available_for_inspector_pickup'
		}
	],
	address: {
		addressLine1: '56 Vincent Square',
		county: 'London',
		postCode: 'SW1P 2NE'
	},
	startedAt: new Date(2022, 2, 3),
	appealType: 'HAS',
	specialism: 'General',
	lpaQuestionnaire: {
		siteVisibleFromPublicLand: true
	},
	appealDetailsFromAppellant: {
		siteVisibleFromPublicLand: true
	}
};

describe('Get more apeals', () => {
	test('gets all appeals yet to be assigned to inspector', async () => {
		// GIVEN
		jest.useFakeTimers({ now: 1_649_319_144_000 });
		databaseConnector.appeal.findMany.mockResolvedValue([appeal25]);

		// WHEN
		const resp = await request.get('/appeals/inspector/more-appeals');

		// THEN
		expect(resp.status).toEqual(200);
		expect(resp.body).toEqual([
			{
				appealId: 25,
				reference: 'APP/Q9999/D/21/5463281',
				address: {
					addressLine1: '56 Vincent Square',
					county: 'London',
					postCode: 'SW1P 2NE'
				},
				appealAge: 35,
				appealType: 'HAS',
				specialist: 'General',
				provisionalVisitType: 'unaccompanied'
			}
		]);
		expect(databaseConnector.appeal.findMany).toHaveBeenCalledWith({
			where: {
				appealStatus: {
					some: {
						status: {
							in: ['available_for_inspector_pickup']
						},
						valid: true
					}
				}
			},
			include: {
				address: true,
				appellant: false,
				lpaQuestionnaire: true,
				appealDetailsFromAppellant: true,
				appealStatus: {
					where: {
						valid: true
					}
				}
			}
		});
	});
});
