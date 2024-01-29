import { request } from '#tests/../app-test.js';
import { jest } from '@jest/globals';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { householdAppeal, linkedAppeals } from '#tests/appeals/mocks.js';
import { linkedAppealRequest, linkedAppealLegacyRequest } from '#tests/linked-appeals/mocks.js';

const { databaseConnector } = await import('#utils/database-connector.js');

describe('appeal linked appeals routes', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('POST', () => {
		test('returns 400 when the ID in the request is null', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/link-appeal`)
				.send({
					...linkedAppealRequest,
					linkedAppealId: null
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});

		test('returns 400 when the ID in the request is not a number', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/link-appeal`)
				.send({
					...linkedAppealRequest,
					linkedAppealId: 'a string'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});

		test('returns 404 when an internal appeal to link is not found', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValueOnce(null);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/link-appeal`)
				.send({
					...linkedAppealRequest,
					linkedAppealId: 100
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(404);
		});

		test('returns 400 when an external appeal reference is empty', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/link-legacy-appeal`)
				.send({
					...linkedAppealLegacyRequest,
					linkedAppealReference: ''
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});

		test('returns 400 when an external appeal reference is null', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValue([]);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/link-legacy-appeal`)
				.send({
					...linkedAppealLegacyRequest,
					linkedAppealReference: null
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});

		test('returns 400 when an internal appeal is already a parent', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValueOnce(householdAppeal);
			// @ts-ignore
			databaseConnector.appealRelationship.findMany.mockResolvedValueOnce(linkedAppeals);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/link-appeal`)
				.send({
					...linkedAppealRequest,
					isCurrentAppealParent: false
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});
	});
});
