import { KeyVaultSecretsClient } from './key-vault-secrets-client.js';
import { LocalKeyVaultSecretsClient } from './local-key-vault-secrets-client.js';

/**
 *
 * @param {boolean} azureKeyVaultEnabled
 * @param {string} secretName
 * @returns
 */
export const getKeyVaultSecretsClient = (azureKeyVaultEnabled, secretName) => {
	return azureKeyVaultEnabled
		? new KeyVaultSecretsClient(secretName)
		: new LocalKeyVaultSecretsClient();
};
