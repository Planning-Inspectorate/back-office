import {
	getDcoStatusDisplayName,
	getDcoStatusTagClasses
} from '../../applications/common/components/mappers/dco-status.mapper.js';

/**
 * @param {{ additionalDetails?: { dcoStatus?: string } }} caseItem
 */
export const buildDcoStatusRow = (caseItem) => {
	const dcoStatusKey = caseItem?.additionalDetails?.dcoStatus ?? '';
	const html = dcoStatusKey
		? `<strong class="govuk-tag ${getDcoStatusTagClasses(dcoStatusKey)}">${getDcoStatusDisplayName(
				dcoStatusKey
		  )}</strong>`
		: '';
	return {
		title: 'DCO status',
		url: 'dco-status',
		html,
		classes: 'project-details__dco-status'
	};
};
