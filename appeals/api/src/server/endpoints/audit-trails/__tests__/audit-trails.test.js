import supertest from 'supertest';
import { jest } from '@jest/globals';
import { app } from '../../../app-test.js';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { householdAppeal, auditTrails } from '#tests/appeals/mocks.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const request = supertest(app);

describe('audit trails routes', () => {
	beforeEach(() => {
		// @ts-ignore
		databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('/appeals/:appealId/audit-trails', () => {
		describe('GET', () => {
			test('gets audit trail entries', async () => {
				// @ts-ignore
				databaseConnector.auditTrail.findMany.mockResolvedValue(auditTrails);

				const { id } = householdAppeal;
				const response = await request
					.get(`/appeals/${id}/audit-trails`)
					.set('azureAdUserId', azureAdUserId);

				expect(response.status).toEqual(200);
				expect(response.body).toEqual([
					{
						azureAdUserId: auditTrails[0].user.azureAdUserId,
						details: auditTrails[0].details,
						loggedDate: auditTrails[0].loggedAt
					}
				]);
			});

			test('returns an empty array if audit trail entries are not found', async () => {
				// @ts-ignore
				databaseConnector.auditTrail.findMany.mockResolvedValue([]);

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
