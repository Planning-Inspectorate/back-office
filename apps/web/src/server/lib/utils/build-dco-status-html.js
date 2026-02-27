import {
	getDcoStatusDisplayName,
	getDcoStatusTagClasses
} from '../../applications/common/components/mappers/dco-status.mapper.js';

/**
 * Builds the DCO status tag HTML.
 *
 * @param {{ additionalDetails?: { dcoStatus?: string } }} caseItem
 */
export const buildDcoStatusHtml = (caseItem) => {
	const dcoStatusKey = caseItem?.additionalDetails?.dcoStatus ?? '';
	return dcoStatusKey
		? `<strong class="govuk-tag ${getDcoStatusTagClasses(dcoStatusKey)}">${getDcoStatusDisplayName(
				dcoStatusKey
		  )}</strong>`
		: '';
};
