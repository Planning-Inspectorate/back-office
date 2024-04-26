import { FeatureFlagClient } from '@pins/feature-flags';

const featureFlagClient = new FeatureFlagClient(
	{ debug: console.log, error: console.error },
	Cypress.env('FEATURE_FLAG_CONNECTION_STRING')
);

/** @type{Record<string, boolean>} */
let featureFlags = {};

featureFlagClient.listFlags().then((flags) => {
	featureFlags = flags;
});

/**
 * @param {string} id
 * @returns {boolean}
 * */
export const getFeatureFlag = (id) => featureFlags[id] ?? false;
