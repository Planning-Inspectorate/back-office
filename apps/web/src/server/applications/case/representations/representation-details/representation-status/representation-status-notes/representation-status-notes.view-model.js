import {
	getRepresentationDetailsPageUrl,
	getChangeStatusPageUrl
} from '../representation-status.utils.js';

/**
 * @typedef {import('../../application-representation-details.view-model.js').Representation} Representation
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
			value: 'CASE_TEAM',
			text: 'Case team',
			checked: false
		},
		{
			value: 'INSPECTOR',
			text: 'Inspector',
			checked: false
		},
		{
			value: 'ADMIN_TEAM',
			text: 'Central admin team',
			checked: false
		},
		{
			value: 'INTERESTED_PARTY',
			text: 'Interested party',
			checked: false
		}
	];

	const radioItemsForInvalidStatus = [
		{
			value: 'DUPLICATE',
			text: 'Duplicate',
			checked: false
		},
		{
			value: 'MERGED',
			text: 'Merged',
			checked: false
		},
		{
			value: 'NOT_RELEVANT',
			text: 'Not relevant',
			checked: false
		},
		{
			value: 'RESUBMITTED',
			text: 'Resubmitted',
			checked: false
		},
		{
			value: 'TEST',
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
 * @returns {object}
 */

export const getRepresentationStatusNotesViewModel = (caseId, repId, representationDetails) => {
	return {
		caseId,
		repId,
		status: representationDetails.status,
		pageHeading: getPageContentByStatus(representationDetails.status).pageHeading,
		radioItems: getPageContentByStatus(representationDetails.status).radioItems,
		summaryPageLinkUrl: getRepresentationDetailsPageUrl(caseId, repId),
		backLinkUrl: `${getChangeStatusPageUrl(caseId, repId)}?changeStatus=${
			representationDetails.status
		}`
	};
};
