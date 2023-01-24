import { jest } from '@jest/globals';
import { ConfidentialClientApplication } from '../../../../../testing/app/app.js';
import { getAccessToken, nodeCache } from '../generate-client-access-token.js';

const azureMsalMock = ConfidentialClientApplication.getMock();

jest.mock('node-cache');

describe('getAccessToken', () => {
	test('returns the token from cache if it is not expired', async () => {
		nodeCache.set('access_token', 'mock_access_token');

		const client = getConfidentialClientApplication();

		const accessToken = await getAccessToken();

		expect(accessToken).toBe('mock_access_token');
		expect(client.acquireTokenByClientCredential).not.toHaveBeenCalled();
	});

	test('generates a new token if the token from cache is expired', async () => {
		nodeCache.flushAll();

		const client = getConfidentialClientApplication();

		const accessToken = await getAccessToken();

		expect(accessToken).toBe('accessToken');
		expect(client.acquireTokenByClientCredential).toHaveBeenCalled();
	});
});

/** @returns {ConfidentialClientApplication} */
function getConfidentialClientApplication() {
	return /** @type {ConfidentialClientApplication} */ (
		azureMsalMock.confidentialClientApplications.last
	);
}
