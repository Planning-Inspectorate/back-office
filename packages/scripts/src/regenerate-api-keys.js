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
	console.log(
		`Attempting to (re)generate Backoffice Applications API keys in ${process.env['KEY_VAULT_NAME']}`
	);
	const secretClient = setUpKeyVaultClient();

	console.log('Key vault client set up');
	const listOfKeyVaultSecretsApiKeys = await getApiKeySecrets(secretClient);
	if (!listOfKeyVaultSecretsApiKeys.length) {
		throw Error('No secrets starting with `backoffice-applications-api-key-*` found in Key-Vault');
	}

	listOfKeyVaultSecretsApiKeys.forEach((keyVaultSecretApiKeyObject) => {
		console.log(`Handling key (re)generation for ${keyVaultSecretApiKeyObject.name}`);

		const parsedApiKeys = JSON.parse(keyVaultSecretApiKeyObject.value || '[]');
		removeOldestKey(parsedApiKeys);

		setExpiryOnPreviouslyNewestKey(parsedApiKeys);

		addNewApiKey(parsedApiKeys);

		keyVaultSecretApiKeyObject.value = JSON.stringify(parsedApiKeys);
	});

	await Promise.all(
		listOfKeyVaultSecretsApiKeys.map((keyVaultSecret) => {
			return disablePreviousKeyVersions(secretClient, keyVaultSecret.name);
		})
	);

	await Promise.all(
		listOfKeyVaultSecretsApiKeys.map((keyVaultSecret) => {
			return secretClient.setSecret(keyVaultSecret.name, keyVaultSecret.value || '{}');
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
		console.log('Removed oldest key from list');
	} else {
		console.log('No oldest key found in list - nothing removed');
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
		console.log("Set expiry on previously 'newest' key");
	} else {
		console.log("No 'newest' key found - no changes made");
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
	console.log("Added newly generated API key to list and assigned status to 'newest'");
};

/**
 * @param {SecretClient} secretClient
 * @param {String} keyVaultSecretName
 */
const disablePreviousKeyVersions = async (secretClient, keyVaultSecretName) => {
	const secretVersionPropertiesIterable =
		secretClient.listPropertiesOfSecretVersions(keyVaultSecretName);
	for await (const secretVersionProperties of secretVersionPropertiesIterable) {
		if (secretVersionProperties.enabled) {
			if (!secretVersionProperties.version) continue;

			await secretClient.updateSecretProperties(
				secretVersionProperties.name,
				secretVersionProperties.version,
				{
					enabled: false
				}
			);
			console.log(
				`Disabled version ${secretVersionProperties.version} of ${secretVersionProperties.name}`
			);
		}
	}
};
