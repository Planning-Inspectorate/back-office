import { featureFlagClient } from '../../../common/feature-flags.js';

/**
 * @param {string} flagName
 * @returns {boolean}
 */
export const isFeatureActive = (flagName) => featureFlagClient.isFeatureActive(flagName);
