import { jest } from '@jest/globals';
import { addApiClientToRequest } from '../add-apiclient-to-request.js';
import { createTestEnvironment } from '#testing/index.js';

const { installMockApi, teardown } = createTestEnvironment();

describe('user-scoped api client', () => {
	beforeEach(() => {
		installMockApi();
	});
	afterEach(teardown);
	it('should return an api client with the request middleware', async () => {
		const req = {
			session: {
				account: {
					homeAccountId: 'user87326549238765'
				}
			}
		};

		// @ts-ignore
		addApiClientToRequest(req, {}, jest.fn());
		// @ts-ignore
		expect(req.apiClient).not.toBeUndefined();
		// @ts-ignore
		const apiDefaults = req.apiClient.defaults;
		expect(apiDefaults).not.toBeUndefined();
	});
});
