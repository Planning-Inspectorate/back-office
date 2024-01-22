import { request } from '../../../app-test.js';
import { jest } from '@jest/globals';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { householdAppeal } from '#tests/appeals/mocks.js';
import { documentCreated } from '#tests/documents/mocks.js';
import { add, sub } from 'date-fns';
import {
	ERROR_MUST_BE_CORRECT_DATE_FORMAT,
	ERROR_MUST_BE_IN_PAST,
	ERROR_CASE_OUTCOME_MUST_BE_ONE_OF,
	ERROR_INVALID_APPEAL_STATE,
	STATE_TARGET_ISSUE_DETERMINATION
} from '#endpoints/constants.js';

const { databaseConnector } = await import('#utils/database-connector.js');

describe('appeal decision routes', () => {
	beforeEach(() => {
		// @ts-ignore
		databaseConnector.appealRelationship.findMany.mockResolvedValue([]);
	});
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('POST', () => {
		test('returns 400 when outcome is not expected', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision`)
				.send({
					outcome: 'unexpected',
					documentDate: '2023-11-10',
					documentGuid: documentCreated.guid
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					outcome: ERROR_CASE_OUTCOME_MUST_BE_ONE_OF
				}
			});
		});
		test('returns 400 when outcome is invalid', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision`)
				.send({
					outcome: 'invalid',
					documentDate: '2023-11-10',
					documentGuid: documentCreated.guid
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					outcome: ERROR_CASE_OUTCOME_MUST_BE_ONE_OF
				}
			});
		});
		test('returns 400 when date is incorrect', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision`)
				.send({
					outcome: 'allowed',
					documentDate: '2023-13-10',
					documentGuid: documentCreated.guid
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					documentDate: ERROR_MUST_BE_CORRECT_DATE_FORMAT
				}
			});
		});
		test('returns 400 when date is in the future', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);

			const today = add(new Date(), { days: 1 });
			const year = today.toLocaleString('default', { year: 'numeric' });
			const month = today.toLocaleString('default', { month: '2-digit' });
			const day = today.toLocaleString('default', { day: '2-digit' });

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision`)
				.send({
					outcome: 'allowed',
					documentDate: [year, month, day].join('-'),
					documentGuid: documentCreated.guid
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					documentDate: ERROR_MUST_BE_IN_PAST
				}
			});
		});
		test('returns 400 when state is not correct', async () => {
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(householdAppeal);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);

			const today = sub(new Date(), { days: 10 });
			const year = today.toLocaleString('default', { year: 'numeric' });
			const month = today.toLocaleString('default', { month: '2-digit' });
			const day = today.toLocaleString('default', { day: '2-digit' });

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision`)
				.send({
					outcome: 'allowed',
					documentDate: [year, month, day].join('-'),
					documentGuid: documentCreated.guid
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(400);
			expect(response.body).toEqual({
				errors: {
					state: ERROR_INVALID_APPEAL_STATE
				}
			});
		});
		test('returns 200 when all good', async () => {
			const correctAppealState = {
				...householdAppeal,
				appealStatus: [
					{
						status: STATE_TARGET_ISSUE_DETERMINATION,
						valid: true
					}
				]
			};
			// @ts-ignore
			databaseConnector.appeal.findUnique.mockResolvedValue(correctAppealState);
			// @ts-ignore
			databaseConnector.document.findUnique.mockResolvedValue(documentCreated);
			// @ts-ignore
			databaseConnector.inspectorDecision.create.mockResolvedValue({});

			const today = sub(new Date(), { days: 10 });
			const year = today.toLocaleString('default', { year: 'numeric' });
			const month = today.toLocaleString('default', { month: '2-digit' });
			const day = today.toLocaleString('default', { day: '2-digit' });

			const response = await request
				.post(`/appeals/${householdAppeal.id}/inspector-decision`)
				.send({
					outcome: 'allowed',
					documentDate: [year, month, day].join('-'),
					documentGuid: documentCreated.guid
				})
				.set('azureAdUserId', azureAdUserId);

			expect(response.status).toEqual(200);
		});
	});
});
