import { addAuthHeadersForBackend } from '@pins/add-auth-headers-for-backend';
import got from 'got';
import config from '@pins/appeals.web/environment/config.js';
import { createHttpRetryParams } from '@pins/platform';

const retryParams = createHttpRetryParams(config.retry);

const serviceName = 'function';
export const requestWithApiKey = got.extend({
	retry: retryParams,
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
