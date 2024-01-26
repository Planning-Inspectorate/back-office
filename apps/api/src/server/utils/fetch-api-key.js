import { getKeyVaultSecretsClient } from '@pins/key-vault-secrets-client';
import config from '#config/config.js';
// import BackOfficeAppError from './app-error.js';

/**
 * @param {string} apiKeyName
 */
export const fetchApiKey = async (apiKeyName) => {
	try {
		const secretsClient = getKeyVaultSecretsClient(config.azureKeyVaultEnabled);
		const apiKey = await secretsClient.getSecret(apiKeyName);
		if (!apiKey.value) {
			console.log('API_KEY_TESTING: getSecret method returned an empty value', 500);
			return;
			// throw new BackOfficeAppError('getSecret method returned an empty value', 500);
		}

		const parsedApiKey = JSON.parse(apiKey.value);
		if (!Array.isArray(parsedApiKey)) {
			console.log('API_KEY_TESTING: Retrieved API key set is not an array');
			return;
			// throw Error('Retrieved API key set is not an array');
		}

		return parsedApiKey;
	} catch (error) {
		// the check is to stop JSON.parse function error leaking key contents
		if (error instanceof SyntaxError) {
			console.log('API_KEY_TESTING: Failed to parse API key object', 500);
			return;
			// throw new BackOfficeAppError('Failed to parse API key object', 500);
		}
		console.log(`API_KEY_TESTING: Fetching API key failure: ${error}`, 500);
		return;
		// throw new BackOfficeAppError(`Fetching API key failure: ${error}`, 500);
	}
};
