import { jest } from '@jest/globals';
import { featureFlagClient } from '../../../src/common/feature-flags.js';

/**
 * Provide mocked value for feature flags
 * @param {boolean} mockedValue
 */
export const installMockFeatureFlags = (mockedValue = false) => {
	// when mockedValue is true, EVERY feature flag is mocked as active
	// when mockedValue is false, EVERY feature flag is mocked as inactive

	jest.spyOn(featureFlagClient, 'isFeatureActive').mockImplementation(() => {
		return mockedValue;
	});
};
