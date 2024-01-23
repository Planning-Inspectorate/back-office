import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

export class KeyVaultSecretsClient {
	constructor() {
		const keyVaultUri = process.env.KEY_VAULT_URI || '';
		const credentials = new DefaultAzureCredential();
		this.client = new SecretClient(keyVaultUri, credentials);
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
