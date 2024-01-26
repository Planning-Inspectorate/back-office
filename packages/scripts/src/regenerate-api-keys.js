import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { randomBytes } from 'crypto';

/**
 * @typedef {Object} ApiKey
 * @property {string} key - The API key.
 * @property {string} status - The status of the API key ('newest' or 'oldest').
 * @property {Date} [expiry] - The optional expiry date for the API key.
 */

const NEWEST = 'newest';
const OLDEST = 'oldest';

// Entry point
export const regenerateApiKeys = async () => {
	const secretClient = setUpKeyVaultClient();

	const listOfKeyVaultSecretsApiKeys = await getApiKeySecrets(secretClient);
	listOfKeyVaultSecretsApiKeys.forEach((keyVaultSecretApiKeyObject) => {
		const parsedApiKeys = JSON.parse(keyVaultSecretApiKeyObject.value || '[]');
		removeOldestKey(parsedApiKeys);
		setExpiryOnPreviouslyNewestKey(parsedApiKeys);
		addNewApiKey(parsedApiKeys);

		keyVaultSecretApiKeyObject.value = JSON.stringify(parsedApiKeys);
	});

	await Promise.all(
		listOfKeyVaultSecretsApiKeys.map((keyVaultSecret) => {
			secretClient.setSecret(keyVaultSecret.name, keyVaultSecret.value || '{}');
		})
	);
};

const setUpKeyVaultClient = () => {
	const credentials = new DefaultAzureCredential();
	const keyVaultUri = `https://${process.env['KEY_VAULT_NAME'] || ''}.vault.azure.net/`;
	return new SecretClient(keyVaultUri, credentials);
};

/**
 *
 * @param {SecretClient} secretClient
 */
const getApiKeySecrets = async (secretClient) => {
	const secretsIterator = secretClient.listPropertiesOfSecrets();
	const apiKeySecrets = [];
	for await (const secretProperties of secretsIterator) {
		const secretName = secretProperties.name;

		if (secretName.toLowerCase().startsWith('backoffice-applications-api-key-')) {
			const secret = await secretClient.getSecret(secretName);
			apiKeySecrets.push(secret);
		}
	}

	return apiKeySecrets;
};

/**
 * @param {Array<ApiKey>} apiKeys
 */
const removeOldestKey = (apiKeys) => {
	const oldestKeyIndex = apiKeys.findIndex((apiKey) => apiKey.status === OLDEST);
	if (oldestKeyIndex !== -1) {
		apiKeys.splice(oldestKeyIndex, 1);
	}
};

/**
 * @param {Array<ApiKey>} apiKeys
 */
const setExpiryOnPreviouslyNewestKey = (apiKeys) => {
	const newestKeyIndex = apiKeys.findIndex((apiKey) => apiKey.status === NEWEST);
	const oneHour = 3600000;
	if (newestKeyIndex !== -1) {
		apiKeys[newestKeyIndex].status = OLDEST;
		apiKeys[newestKeyIndex].expiry = new Date(Date.now() + oneHour);
	}
};

/**
 * @param {Array<ApiKey>} apiKeys
 */
const addNewApiKey = (apiKeys) => {
	const randomBuffer = randomBytes(16);
	const apiKey = randomBuffer.toString('hex');

	apiKeys.push({
		key: apiKey,
		status: NEWEST
	});
};
