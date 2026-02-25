import {
	getDcoStatusDisplayName,
	getDcoStatusTagClasses
} from '../../applications/common/components/mappers/dco-status.mapper.js';

/**
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

/**
 * @param {{ additionalDetails?: { dcoStatus?: string } }} caseItem
 */
export const buildDcoStatusRow = (caseItem) => {
	return {
		title: 'DCO status',
		url: 'dco-status',
		html: buildDcoStatusHtml(caseItem),
		classes: 'project-details__dco-status'
	};
};
