import { repStatusMap } from '../utils/representation-status-map.js';
import { getRepresentationDetailsPageUrl } from './representation-status.utils.js';

/**
 * @typedef {import('../../relevant-representation.types.js').Representation} Representation
 */

/**
 * @param {string} status
 * @param {string|boolean} isStatusEdit
 * @returns {Array<Object>}
 */
const getRadioItems = (status, isStatusEdit) => {
	const optionsList = [
		{
			value: repStatusMap.awaitingReview,
			text: 'Awaiting review',
			checked: false
		},
		{
			value: repStatusMap.referred,
			text: 'Referred',
			checked: false
		},
		{
			value: repStatusMap.invalid,
			text: 'Invalid',
			checked: false
		},
		{
			value: repStatusMap.valid,
			text: 'Valid',
			checked: false
		},
		{
			value: repStatusMap.withdrawn,
			text: 'Withdrawn',
			checked: false
		}
	];

	return optionsList.map((option) => {
		if (!!isStatusEdit && option.value === status) {
			option.checked = true;
		}
		return option;
	});
};

/**
 * @param {string} caseId
 * @param {string} repId
 * @param {string|*} isStatusEdit
 * @param {Representation} representationDetails
 * @returns {object}
 */

export const getRepresentationStatusViewModel = (
	caseId,
	repId,
	representationDetails,
	isStatusEdit
) => {
	const oldStatus = representationDetails.status;
	const status = isStatusEdit ? isStatusEdit : oldStatus;
	const { represented } = representationDetails;

	return {
		caseId,
		repId,
		orgOrName: represented.organisationName ? represented.organisationName : represented.fullName,
		pageHeading: 'Change status',
		status,
		radioItems: getRadioItems(status, isStatusEdit),
		backLinkUrl: getRepresentationDetailsPageUrl(caseId, repId)
	};
};
