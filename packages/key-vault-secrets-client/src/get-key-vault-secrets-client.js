import { KeyVaultSecretsClient } from './key-vault-secrets-client.js';
import { LocalKeyVaultSecretsClient } from './local-key-vault-secrets-client.js';

/**
 *
 * @param {boolean} azureKeyVaultEnabled
 * @returns {KeyVaultSecretsClient | LocalKeyVaultSecretsClient}
 */
export const getKeyVaultSecretsClient = (azureKeyVaultEnabled) => {
	return azureKeyVaultEnabled ? new KeyVaultSecretsClient() : new LocalKeyVaultSecretsClient();
};
