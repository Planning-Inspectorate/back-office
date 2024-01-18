import { KeyVaultSecretsClient } from './key-vault-secrets-client.js';
import { LocalKeyVaultSecretsClient } from './local-key-vault-secrets-client.js';

/**
 *
 * @param {boolean} keyVaultEnabled
 * @param {string} keyVaultUri
 * @returns
 */
export const getKeyVaultSecretsClient = (keyVaultEnabled, keyVaultUri) => {
	return keyVaultEnabled
		? new KeyVaultSecretsClient(keyVaultUri)
		: new LocalKeyVaultSecretsClient();
};
