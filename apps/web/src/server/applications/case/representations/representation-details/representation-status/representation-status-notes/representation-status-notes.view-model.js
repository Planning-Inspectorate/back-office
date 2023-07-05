import {
	getRepresentationDetailsPageUrl,
	getChangeStatusPageUrl
} from '../representation-status.utils.js';

/**
 * @typedef {import('../../../relevant-representation.types.js').Representation} Representation
 */

/**
 *
 * @param {string} newStatus
 * @returns {{pageHeading: String, radioItems: Object[]}} page heading and title
 */
const getPageContentByStatus = (newStatus) => {
	let pageHeading = 'Notes';
	/** @type {Object[]} */
	let radioItems = [];

	const radioItemsForReferredStatus = [
		{
			value: 'Case Team',
			text: 'Case Team',
			checked: false
		},
		{
			value: 'Inspector',
			text: 'Inspector',
			checked: false
		},
		{
			value: 'Central Admin Team',
			text: 'Central Admin Team',
			checked: false
		},
		{
			value: 'Interested Party',
			text: 'Interested Party',
			checked: false
		}
	];

	const radioItemsForInvalidStatus = [
		{
			value: 'Duplicate',
			text: 'Duplicate',
			checked: false
		},
		{
			value: 'Merged',
			text: 'Merged',
			checked: false
		},
		{
			value: 'Not relevant',
			text: 'Not relevant',
			checked: false
		},
		{
			value: 'Resubmitted',
			text: 'Resubmitted',
			checked: false
		},
		{
			value: 'Test',
			text: 'TEST',
			checked: false
		}
	];

	switch (newStatus.toLowerCase()) {
		case 'referred':
			pageHeading = 'Who are you referring the representation to?';
			radioItems = radioItemsForReferredStatus;
			break;
		case 'invalid':
			pageHeading = 'Why is the representation invalid?';
			radioItems = radioItemsForInvalidStatus;
			break;

		default:
			pageHeading = 'Notes';
			radioItems = [];
			break;
	}

	return { pageHeading, radioItems };
};

/**
 * @param {string} caseId
 * @param {string} repId
 * @param {Representation} representationDetails
 * @param {string} newStatus
 * @returns {object}
 */

export const getRepresentationStatusNotesViewModel = (
	caseId,
	repId,
	representationDetails,
	newStatus
) => {
	return {
		caseId,
		repId,
		status: newStatus,
		pageHeading: getPageContentByStatus(newStatus).pageHeading,
		radioItems: getPageContentByStatus(newStatus).radioItems,
		summaryPageLinkUrl: getRepresentationDetailsPageUrl(caseId, repId),
		backLinkUrl: `${getChangeStatusPageUrl(caseId, repId)}?changeStatus=${newStatus}`
	};
};
