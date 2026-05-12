import { FeatureFlagClient } from '@pins/feature-flags';

export async function loadFlags() {
	const staticFeatureFlagOverrides = Cypress.env('STATIC_FEATURE_FLAG_OVERRIDES');

	if (typeof process !== 'undefined' && staticFeatureFlagOverrides) {
		process.env = process.env || {};
		process.env.STATIC_FEATURE_FLAG_OVERRIDES = staticFeatureFlagOverrides;
	}

	const featureFlagClient = new FeatureFlagClient(
		{ debug: console.log, error: console.error },
		Cypress.env('FEATURE_FLAG_CONNECTION_STRING'),
		Cypress.env('STATIC_FEATURE_FLAGS_ENABLED') === 'true'
	);

	await featureFlagClient.loadFlags();
	return featureFlagClient.featureFlags;
}
