import { addAuthHeadersForBackend } from '@pins/add-auth-headers-for-backend';
import got from 'got';

const serviceName = 'function';
export const gotInstance = got.extend({
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
