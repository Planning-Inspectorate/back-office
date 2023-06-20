import { url } from '../../../../../lib/nunjucks-filters/url.js';

/**
 * @typedef {object} Representation
 * @property {number} id
 * @property {string} reference
 * @property {string} status
 * @property {Contact[]} contacts
 * @property {boolean} redacted
 * @property {string} received
 * @property {string} originalRepresentation
 * @property {string} representationExcerpt
 * @property {string} redactedRepresentation
 * @property {string} redactedRepresentationExcerpt
 * @property {string} redactedNotes
 * @property {string} redactedNotesExcerpt
 * @property {string} redactedBy
 */

/**
 * @typedef {object} Contact
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string} organisationName
 * @property {string|null} contactMethod
 * @property {string} type
 * @property {string|null} jobTitle
 * @property {boolean} under18
 * @property {string|null} email
 * @property {string|null} phoneNumber
 * @property {object} address
 */

/**
 * @param {string} caseId
 * @param {string} representationId
 * @returns { string }
 */
export const getPreviousPageUrl = (caseId, representationId) =>
	url('representation-details', {
		caseId: parseInt(caseId),
		representationId: parseInt(representationId)
	});

/**
 * @param {string} caseId
 * @param {string} representationId
 * @returns { string }
 */
export const getNextPageUrl = (caseId, representationId) =>
	url('representation-status-result', {
		caseId: parseInt(caseId),
		representationId: parseInt(representationId)
	});

/**
 * @param {Representation} representation
 * @returns {string} organisation name or firstname + lastname
 */
const getOrgOrNameForRepresentation = ({ contacts }) => {
	let nameOrOrg = '';

	contacts.forEach((contact) => {
		switch (contact.type.toLowerCase()) {
			case 'organisation':
				nameOrOrg = contact.organisationName;
				break;

			case 'agent':
			case 'person':
				nameOrOrg = `${contact.firstName} ${contact.lastName}`;
				break;
		}
	});

	return nameOrOrg;
};

const radioItems = [
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

/**
 * @param {string} caseId
 * @param {string} repId
 * @param {Representation} representationDetails
 * @returns {object}
 */

export const getRepresentationStatusViewModel = (caseId, repId, representationDetails) => {
	return {
		caseId,
		repId,
		orgOrName: getOrgOrNameForRepresentation(representationDetails),
		pageHeading: 'Change status',
		status: representationDetails.status,
		radioItems,
		backLinkUrl: getPreviousPageUrl(caseId, repId)
	};
};
