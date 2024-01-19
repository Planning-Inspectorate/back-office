export class LocalKeyVaultSecretsClient {
	/**
	 * @param {string} secretName
	 * @returns {Promise<import('@azure/keyvault-secrets').KeyVaultSecret>}
	 */
	getSecret = (secretName) => {
		return new Promise((resolve) => {
			return resolve({
				properties: {
					vaultUrl: 'https://a-vault-url.net',
					name: secretName
				},
				name: secretName,
				value: this.#createTestSecret(secretName)
			});
		});
	};

	/**
	 * Use this method to add any other secret format that is needed
	 * @param {string} secretName
	 */
	#createTestSecret = (secretName) => {
		switch (true) {
			case secretName.endsWith('api-key'):
				return this.#createApiKeySecret();
			default:
				return 'some-secret';
		}
	};

	#createApiKeySecret = () => {
		const expiry = new Date();
		expiry.setHours(expiry.getHours() + 1);

		return JSON.stringify([
			{ key: '123', status: 'newest' },
			{
				key: '456',
				status: 'oldest',
				expiry
			}
		]);
	};
}
