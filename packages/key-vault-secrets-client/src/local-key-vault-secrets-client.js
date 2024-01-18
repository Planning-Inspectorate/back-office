export class LocalKeyVaultSecretsClient {
	/**
	 *
	 * @param {string} secretName
	 * @returns {Promise<import('@azure/keyvault-secrets').KeyVaultSecret>}
	 */
	getSecret = (secretName) => {
		return new Promise((resolve) =>
			resolve({
				properties: {
					vaultUrl: 'https://a-vault-url.net',
					name: secretName
				},
				name: secretName,
				value: `this-is-a-secret-with-name-${secretName}`
			})
		);
	};
}
