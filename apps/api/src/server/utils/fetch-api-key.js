import { getKeyVaultSecretsClient } from '@pins/key-vault-secrets-client';
import config from '#config/config.js';
import BackOfficeAppError from './app-error.js';

/**
 * @param {string} apiKeyName
 */
export const fetchApiKey = async (apiKeyName) => {
	const secretsClient = getKeyVaultSecretsClient(config.azureKeyVaultEnabled, apiKeyName);
	const apiKey = await secretsClient.getSecret(apiKeyName);

	if (!apiKey.value) throw new BackOfficeAppError('Failed to acquire API key', 500);

	try {
		return JSON.parse(apiKey.value);
	} catch (error) {
		throw Error('Failed to parse API key object');
	}
};
