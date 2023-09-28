import supertest from 'supertest';
import { app } from '../../../app-test.js';
import { azureAdUserId, householdAppeal } from '../../../tests/data.js';

const { databaseConnector } = await import('../../../utils/database-connector.js');
const request = supertest(app);

describe('audit trails routes', () => {
	describe('/appeals/:appealId/audit-trails', () => {
		describe('GET', () => {
			test('gets audit trail entries', async () => {
				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { auditTrail, id } = householdAppeal;
				const response = await request
					.get(`/appeals/${id}/audit-trails`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual([
					{
						azureAdUserId: auditTrail[0].user.azureAdUserId,
						details: auditTrail[0].details,
						loggedDate: auditTrail[0].loggedAt
					}
				]);
			});

			test('returns an empty array if audit trail entries are not found', async () => {
				householdAppeal.auditTrail = [];

				// @ts-ignore
				databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

				const { id } = householdAppeal;
				const response = await request
					.get(`/appeals/${id}/audit-trails`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual([]);
			});
		});
	});
});
