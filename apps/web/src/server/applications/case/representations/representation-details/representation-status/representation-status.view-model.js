import { getOrgOrNameForRepresentation } from '../representation-details.utilities.js';
import { getRepresentationDetailsPageUrl } from './representation-status.utils.js';

/**
 * @typedef {import('../application-representation-details.view-model.js').Representation} Representation
 */

/**
 * @param {string} status
 * @param {string|boolean} isStatusEdit
 * @returns {Array<Object>}
 */
const getRadioItems = (status, isStatusEdit) => {
	const optionsList = [
		{
			value: 'AWAITING_REVIEW',
			text: 'Awaiting review',
			checked: false
		},
		{
			value: 'REFERRED',
			text: 'Referred',
			checked: false
		},
		{
			value: 'INVALID',
			text: 'Invalid',
			checked: false
		},
		{
			value: 'VALID',
			text: 'Valid',
			checked: false
		},
		{
			value: 'WITHDRAWN',
			text: 'Withdrawn',
			checked: false
		}
	];

	return optionsList.map((option) => {
		if (isStatusEdit && option.value === status) {
			option.checked = true;
		}
		return option;
	});
};

/**
 * @param {string} caseId
 * @param {string} repId
 * @param {string|boolean} isStatusEdit
 * @param {Representation} representationDetails
 * @returns {object}
 */

export const getRepresentationStatusViewModel = (
	caseId,
	repId,
	isStatusEdit,
	representationDetails
) => {
	return {
		caseId,
		repId,
		orgOrName: getOrgOrNameForRepresentation(representationDetails),
		pageHeading: 'Change status',
		status: representationDetails.status,
		radioItems: getRadioItems(representationDetails.status, isStatusEdit),
		backLinkUrl: getRepresentationDetailsPageUrl(caseId, repId)
	};
};
