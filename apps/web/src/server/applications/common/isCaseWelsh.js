import { featureFlagClient } from '../../../common/feature-flags.js';

/**
 * @param {Array<{name: string}>} regions
 * @returns {boolean}
 
 */
export const isCaseRegionWales = (regions) => {
	if (!featureFlagClient.isFeatureActive('applic-55-welsh-translation') || !regions) {
		return false;
	}

	return Boolean(regions.find((region) => region.name === 'wales'));
};
