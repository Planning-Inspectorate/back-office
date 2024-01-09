import { request } from '#tests/../app-test.js';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { householdAppeal } from '#tests/appeals/mocks.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const appealTypes = [
	{ id: 1, shorthand: 'A', code: 'A', type: 'TYPE A', enabled: false },
	{ id: 2, shorthand: 'B', code: 'B', type: 'TYPE B', enabled: false }
];

describe('appeal change type resubmit routes', () => {
	describe('POST', () => {
		test('returns 400 when date is in the past', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			databaseConnector.appealType.findMany.mockResolvedValue(appealTypes);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/appeal-change-request`)
				.send({
					newAppealTypeId: 1,
					newAppealTypeFinalDate: '2023-02-02'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
		});
		test('returns 400 when appeal type is not matched', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			databaseConnector.appealType.findMany.mockResolvedValue(appealTypes);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/appeal-change-request`)
				.send({
					newAppealTypeId: 12,
					newAppealTypeFinalDate: '2024-02-02'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					newAppealTypeId: 'Not found'
				}
			});
		});
	});
});

describe('appeal change type transfer routes', () => {
	describe('POST', () => {
		test('returns 400 when appeal type is not matched', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			databaseConnector.appealType.findMany.mockResolvedValue(appealTypes);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/appeal-transfer-request`)
				.send({
					newAppealTypeId: 12
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					newAppealTypeId: 'Not found'
				}
			});
		});
	});
});
