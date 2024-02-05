// @ts-nocheck
import { jest } from '@jest/globals';
import { request } from '../../../app-test.js';
import { azureAdUserId } from '#tests/shared/mocks.js';
import { parseHorizonGetCaseResponse } from '#utils/mapping/map-horizon.js';
import {
	horizonGetCaseSuccessResponse,
	horizonGetCaseNotFoundResponse
} from '#tests/horizon/mocks.js';

const { default: got } = await import('got');

describe('/appeals/transferred-appeal/:appealReference', () => {
	describe('GET', () => {
		beforeEach(() => {
			jest.resetAllMocks();
		});
		test('get 200 and {caseFound: true} when an appeal exists in Horizon', async () => {
			got.post.mockReturnValueOnce({
				json: jest
					.fn()
					.mockResolvedValueOnce(parseHorizonGetCaseResponse(horizonGetCaseSuccessResponse))
			});
			const response = await request
				.get(`/appeals/transferred-appeal/1`)
				.set('azureAdUserId', azureAdUserId);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				caseFound: true
			});
		});
		test('get 200 and {caseFound: false} when an appeal exists in Horizon', async () => {
			got.post.mockReturnValueOnce({
				json: jest.fn().mockRejectedValueOnce({
					response: { body: parseHorizonGetCaseResponse(horizonGetCaseNotFoundResponse) }
				})
			});
			const response = await request
				.get(`/appeals/transferred-appeal/1`)
				.set('azureAdUserId', azureAdUserId);
			expect(response.status).toEqual(200);
			expect(response.body).toEqual({
				caseFound: false
			});
		});
		test('get 500 when Horizon does not respond', async () => {
			const response = await request
				.get(`/appeals/transferred-appeal/1`)
				.set('azureAdUserId', azureAdUserId);
			expect(response.status).toEqual(500);
		});
	});
});
