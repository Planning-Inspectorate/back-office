import { addAuthHeadersForBackend } from '@pins/add-auth-headers-for-backend';
import got from 'got';

const serviceName = 'function';
export const requestWithApiKey = got.extend({
	retry: {
		limit: 3,
		statusCodes: [500, 502, 503, 504]
	},
	hooks: {
		beforeRequest: [
			async (options) =>
				await addAuthHeadersForBackend(options, {
					azureKeyVaultEnabled: true,
					apiKeyName: `backoffice-applications-api-key-${serviceName}`,
					callingClient: serviceName
				})
		]
	}
});
