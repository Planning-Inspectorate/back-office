import { FeatureFlagClient } from '@pins/feature-flags';

export async function loadFlags() {
	const featureFlagClient = new FeatureFlagClient(
		{ debug: console.log, error: console.error },
		Cypress.env('FEATURE_FLAG_CONNECTION_STRING'),
		Cypress.env('STATIC_FEATURE_FLAGS_ENABLED') === 'true'
	);

	return await featureFlagClient.listFlags();
}
