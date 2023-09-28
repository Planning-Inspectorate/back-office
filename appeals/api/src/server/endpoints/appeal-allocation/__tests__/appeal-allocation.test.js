import { request } from '#tests/../app-test.js';
import { azureAdUserId, householdAppeal } from '#tests/data.js';
import { ERROR_APPEAL_ALLOCATION_LEVELS, ERROR_NOT_FOUND } from '#endpoints/constants.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const specialisms = [
	{ id: 1, name: 'Specialism' },
	{ id: 2, name: 'SuperSpecialism' }
];

describe('appeal allocation routes', () => {
	describe('PATCH', () => {
		test('returns 400 when level is not a string', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/appeal-allocation`)
				.send({
					specialisms: [3, 4],
					level: 32
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					level: 'Invalid value'
				}
			});
		});

		test('returns 400 when level is not found', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/appeal-allocation`)
				.send({
					specialisms: [3, 4],
					level: 'Z'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					level: ERROR_APPEAL_ALLOCATION_LEVELS
				}
			});
		});

		test('returns 400 when specialism is not found', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.specialism.findMany.mockResolvedValue(specialisms);

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/appeal-allocation`)
				.send({
					specialisms: [3, 4],
					level: 'A'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					specialisms: ERROR_NOT_FOUND
				}
			});
		});

		test('returns 200 and update appeal when all good', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.specialism.findMany.mockResolvedValue(specialisms);
			// @ts-ignore
			databaseConnector.$transaction[
				// @ts-ignore
				(databaseConnector.appealSpecialism.deleteMany.mockResolvedValue([]),
				// @ts-ignore
				databaseConnector.appealSpecialism.createMany.mockResolvedValue([]),
				// @ts-ignore
				databaseConnector.appealAllocation.upsert.mockResolvedValue({}))
			];

			const response = await request
				.patch(`/appeals/${householdAppeal.id}/appeal-allocation`)
				.send({
					specialisms: [1, 2],
					level: 'A'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(200);
		});
	});
});
