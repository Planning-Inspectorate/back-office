import { getKeyVaultSecretsClient } from '@pins/key-vault-secrets-client';
import config from '@pins/applications.web/environment/config.js';

/**
 * @param {string} apiKeyName
 */
export const fetchApiKey = async (apiKeyName) => {
	try {
		const secretsClient = getKeyVaultSecretsClient(config.azureKeyVaultEnabled, apiKeyName);
		const apiKey = await secretsClient.getSecret(apiKeyName);
		if (!apiKey.value) throw new Error('getSecret method returned an empty value');

		const apiKeyPair = JSON.parse(apiKey.value);
		if (!Array.isArray(apiKeyPair)) {
			throw Error('Retrieved API key set is not an array');
		}

		return apiKeyPair.find((key) => key.status === 'newest');
	} catch (error) {
		// the check is to stop JSON.parse function error leaking key contents
		if (error instanceof SyntaxError) {
			throw new Error('Failed to parse API key object');
		}
		throw Error(`Fetching API key failure: ${error}`);
	}
};
