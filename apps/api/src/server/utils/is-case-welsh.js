import * as caseRepository from '#repositories/case.repository.js';
import { featureFlagClient } from '#utils/feature-flags.js';

/**
 * Is case welsh
 *
 * @param caseId
 * @returns {Promise<false|*>}
 */
export default async function isCaseWelsh(caseId) {
	const caseData = await caseRepository.getById(caseId, { regions: true });
	if (!caseData) throw new Error(`Could not find examination a case with ID ${caseId}`);

	const regionsIncludeWelsh = caseData.ApplicationDetails?.regions?.some(
		(item) => item.region.name === 'wales'
	);
	return (
		regionsIncludeWelsh && (await featureFlagClient.isFeatureActive('applic-55-welsh-translation'))
	);
}
