import { request } from '#tests/../app-test.js';
import { jest } from '@jest/globals';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { householdAppeal } from '#tests/appeals/mocks.js';
import { ERROR_NOT_FOUND, ERROR_INVALID_APPEAL_STATE } from '#endpoints/constants.js';

const { databaseConnector } = await import('#utils/database-connector.js');
const appealTypes = [
	{ id: 1, shorthand: 'A', code: 'A', type: 'TYPE A', enabled: false },
	{ id: 2, shorthand: 'B', code: 'B', type: 'TYPE B', enabled: false }
];
const appealsWithValidStatus = [
	{
		...householdAppeal,
		appealStatus: [
			{
				status: 'lpa_questionnaire_due',
				valid: true
			}
		]
	},
	{
		...householdAppeal,
		appealStatus: [
			{
				status: 'issue_determination',
				valid: true
			}
		]
	}
];
const appealsWithInvalidStatus = [
	{
		...householdAppeal,
		appealStatus: [
			{
				status: 'closed',
				valid: true
			}
		]
	}
];

describe('appeal change type resubmit routes', () => {
	beforeEach(() => {
		// @ts-ignore
		databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('POST', () => {
		test('returns 400 when date is in the past', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealsWithValidStatus[0]);
			// @ts-ignore
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
			databaseConnector.appeal.findUnique.mockResolvedValue(appealsWithValidStatus[1]);
			// @ts-ignore
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
					newAppealTypeId: ERROR_NOT_FOUND
				}
			});
		});
		test('returns 400 when appeal status is incorrect', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealsWithInvalidStatus[0]);
			// @ts-ignore
			databaseConnector.appealType.findMany.mockResolvedValue(appealTypes);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/appeal-change-request`)
				.send({
					newAppealTypeId: 1,
					newAppealTypeFinalDate: '2024-02-02'
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					appealStatus: ERROR_INVALID_APPEAL_STATE
				}
			});
		});
	});
});

describe('appeal change type transfer routes', () => {
	describe('POST', () => {
		test('returns 400 when appeal type is not matched', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealsWithValidStatus[0]);
			// @ts-ignore
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
					newAppealTypeId: ERROR_NOT_FOUND
				}
			});
		});

		test('returns 400 when appeal status is incorrect', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(appealsWithInvalidStatus[0]);
			// @ts-ignore
			databaseConnector.appealType.findMany.mockResolvedValue(appealTypes);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/appeal-transfer-request`)
				.send({
					newAppealTypeId: 1
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					appealStatus: ERROR_INVALID_APPEAL_STATE
				}
			});
		});
	});
});
