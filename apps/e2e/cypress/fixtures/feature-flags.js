import { FeatureFlagClient } from '@pins/feature-flags';

export async function loadFlags() {
	const featureFlagClient = new FeatureFlagClient(
		{ debug: console.log, error: console.error },
		Cypress.env('FEATURE_FLAG_CONNECTION_STRING')
	);

	return await featureFlagClient.listFlags();
}