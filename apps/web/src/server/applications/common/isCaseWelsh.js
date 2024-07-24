import { featureFlagClient } from '../../../common/feature-flags.js';
import { getCase } from './services/case.service.js';

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

/**
 * @param {number} caseId
 * @returns {Promise<boolean>}
 * */
export const isCaseWelsh = async (caseId) => {
	if (!featureFlagClient.isFeatureActive('applic-55-welsh-translation')) {
		return false;
	}

	const caseObj = await getCase(caseId);
	if (!caseObj.geographicalInformation) {
		return false;
	}

	return isCaseRegionWales(caseObj.geographicalInformation.regions);
};
