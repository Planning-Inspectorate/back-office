import * as caseRepository from '#repositories/case.repository.js';
import { featureFlagClient } from '#utils/feature-flags.js';

/**
 * Is case welsh
 *
 * @param caseId
 * @returns {Promise<false|*>}
 */
export default async function isCaseWelsh(caseId) {
	if (!(await featureFlagClient.isFeatureActive('applic-55-welsh-translation'))) {
		return false;
	}

	const caseData = await caseRepository.getById(caseId, { regions: true });
	if (!caseData) throw new Error(`Could not find a case with ID ${caseId}`);

	return caseData.ApplicationDetails?.regions?.some((item) => item.region.name === 'wales');
}
