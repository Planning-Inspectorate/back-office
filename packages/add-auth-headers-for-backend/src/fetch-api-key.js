import { getKeyVaultSecretsClient } from '@pins/key-vault-secrets-client';

/**
 * @param {boolean} azureKeyVaultEnabled
 * @param {string} apiKeyName
 */
export const fetchApiKey = async (azureKeyVaultEnabled, apiKeyName) => {
	try {
		// const secretsClient = getKeyVaultSecretsClient(config.azureKeyVaultEnabled);
		// trycatch and let vars are temporary to keep failures silent
		let secretsClient;
		let apiKey;
		try {
			secretsClient = getKeyVaultSecretsClient(azureKeyVaultEnabled);
			apiKey = await secretsClient.getSecret(apiKeyName);
		} catch (error) {
			console.log('API_KEY_TESTING: unable to get secret from key vault');
			return;
		}
		if (!apiKey.value) {
			console.log('API_KEY_TESTING: getSecret method returned an empty value');
			return;
			// throw new Error('getSecret method returned an empty value')
		}

		const apiKeyPair = JSON.parse(apiKey.value);
		if (!Array.isArray(apiKeyPair)) {
			console.log('API_KEY_TESTING: Retrieved API key set is not an array');
			return;
			// throw Error('Retrieved API key set is not an array');
		}

		return apiKeyPair.find((key) => key.status === 'newest');
	} catch (error) {
		// the check is to stop JSON.parse function error leaking key contents
		if (error instanceof SyntaxError) {
			console.log('API_KEY_TESTING: Failed to parse API key object');
			return;
			// throw new Error('Failed to parse API key object');
		}
		console.log(`API_KEY_TESTING: Fetching API key failure: ${error}`);
		return;
		// throw Error(`Fetching API key failure: ${error}`);
	}
};
