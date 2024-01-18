import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export class KeyVaultSecretsClient {
	/**
	 *
	 * @param {string} keyVaultUri
	 */
	constructor(keyVaultUri) {
		this.client = new SecretClient(keyVaultUri, new DefaultAzureCredential());
	}

	/**
	 *
	 * @param {string} secretName
	 * @returns {Promise<import('@azure/keyvault-secrets').KeyVaultSecret>}
	 */
	getSecret = (secretName) => {
		return this.client.getSecret(secretName);
	};
}
