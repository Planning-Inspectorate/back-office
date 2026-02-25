import { featureFlagClient } from '../../../common/feature-flags.js';

/**
 * @param {string} flagName
 * @returns {boolean}
 */
export const isFeatureActive = (flagName) => featureFlagClient.isFeatureActive(flagName);

/**
 * @param {string} flagName
 * @param {string} caseReference
 * @returns {boolean}
 */
export const isFeatureActiveForCase = (flagName, caseReference) =>
	featureFlagClient.isFeatureActiveForCase(flagName, caseReference);
