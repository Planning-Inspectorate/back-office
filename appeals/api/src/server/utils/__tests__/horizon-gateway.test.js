// @ts-nocheck
import { jest } from '@jest/globals';
import { parseHorizonGetCaseResponse } from '#utils/mapping/map-horizon.js';
import {
	horizonGetCaseSuccessResponse,
	horizonGetCaseNotFoundResponse,
	horizonGetCaseOtherErrorResponse
} from '#tests/horizon/mocks.js';
import { getAppealFromHorizon } from '#utils/horizon-gateway.js';
const { default: got } = await import('got');

describe('Horizon gateway', () => {
	describe('GetCase success response', () => {
		it('should return a valid linkable appeal summary', async () => {
			got.post.mockReturnValueOnce({
				json: jest
					.fn()
					.mockResolvedValue(parseHorizonGetCaseResponse(horizonGetCaseSuccessResponse))
			});
			const horizonAppeal = await getAppealFromHorizon('3000359');
			console.log(horizonAppeal);
			expect(horizonAppeal).toBeDefined();
		});
	});
	describe('GetCase failure responses', () => {
		it('should return a 404 if the case is not found', async () => {
			got.post.mockReturnValueOnce({
				json: jest
					.fn()
					.mockRejectedValue({
						response: { body: parseHorizonGetCaseResponse(horizonGetCaseNotFoundResponse) }
					})
			});
			let response = await getAppealFromHorizon('1').catch((error) => {
				return error;
			});
			expect(response).toBe(404);
		});
		it('should return a 500 for other errors', async () => {
			got.post.mockReturnValueOnce({
				json: jest
					.fn()
					.mockRejectedValue({
						response: { body: parseHorizonGetCaseResponse(horizonGetCaseOtherErrorResponse) }
					})
			});
			let response = await getAppealFromHorizon('1').catch((error) => {
				return error;
			});
			expect(response).toBe(500);
		});
	});
});
