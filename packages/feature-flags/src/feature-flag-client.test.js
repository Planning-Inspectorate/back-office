import { FeatureFlagClient } from './feature-flag-client.js';
import { AZURE_AI_LANGUAGE_REDACTION } from './feature-flags.js';

describe('feature-flag-client', () => {
	it('should export a class', () => {
		expect(FeatureFlagClient).toBeDefined();
		expect(typeof FeatureFlagClient).toBe('function');
	});

	it('should create an instance of FeatureFlagClient', () => {
		const client = new FeatureFlagClient(console, 'fake-connection-string', true);
		expect(client).toBeInstanceOf(FeatureFlagClient);
	});

	it('should have methods isFeatureActive and isFeatureActiveForCase', () => {
		const client = new FeatureFlagClient(console, 'fake-connection-string', true);
		expect(typeof client.isFeatureActive).toBe('function');
		expect(typeof client.isFeatureActiveForCase).toBe('function');
	});

	it('should return static flags', async () => {
		const client = new FeatureFlagClient(console, 'fake-connection-string', true);
		await client.loadFlags();
		expect(client.isFeatureActive('boas-1-test-feature')).toBe(true);
		expect(client.isFeatureActive(AZURE_AI_LANGUAGE_REDACTION)).toBe(false);
		expect(client.isFeatureActiveForCase(AZURE_AI_LANGUAGE_REDACTION, 'BC0110003')).toBe(true);
		expect(client.isFeatureActiveForCase(AZURE_AI_LANGUAGE_REDACTION, 'BLAH')).toBe(false);
	});

	it('should handle feature flags with Azure App Configuration', async () => {
		const client = new FeatureFlagClient(console, 'fake-connection-string', false);
		const contentType = 'application/vnd.microsoft.appconfig.ff+json;charset=utf-8';
		client.client = {
			listConfigurationSettings: async () => [
				{
					contentType,
					value: JSON.stringify({
						id: 'boas-1-test-feature',
						enabled: true,
						conditions: { client_filters: [] }
					})
				},
				{
					contentType,
					value: JSON.stringify({
						id: 'boas-2-test-feature',
						enabled: false,
						conditions: { client_filters: [] }
					})
				},
				{
					contentType,
					value: JSON.stringify({
						id: AZURE_AI_LANGUAGE_REDACTION,
						enabled: true,
						conditions: {
							client_filters: [
								{
									parameters: {
										Audience: {
											Users: ['BC0110003']
										}
									}
								}
							]
						}
					})
				}
			]
		};
		await client.loadFlags();
		expect(client.isFeatureActive('boas-1-test-feature')).toBe(true);
		expect(client.isFeatureActive('boas-2-test-feature')).toBe(false);
		expect(client.isFeatureActiveForCase(AZURE_AI_LANGUAGE_REDACTION, 'BC0110003')).toBe(true);
		expect(client.isFeatureActiveForCase(AZURE_AI_LANGUAGE_REDACTION, 'BLAH')).toBe(false);
	});
});
