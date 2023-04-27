import { format } from 'date-fns';

/**
 * @typedef {object} Representation
 * @property {number} id
 * @property {string} reference
 * @property {string} status
 * @property {Contact[]} contacts
 * @property {boolean} redacted
 * @property {string} received
 * @property {string} originalRepresentation
 * @property {string|null} redactedRepresentation
 */

/**
 * @typedef {object} Address
 * @property {string|null} addressLine1
 * @property {string|null} addressLine2
 * @property {string|null} town
 * @property {string|null} county
 * @property {string|null} postcode
 */

/**
 * @typedef {object} Contact
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string|null} organisationName
 * @property {string} type
 * @property {string|null} jobTitle
 * @property {boolean} under18
 * @property {string|null} email
 * @property {string|null} phoneNumber
 * @property {Address} address
 */

/**
 * @param {object} representation
 * @param {Contact[]} representation.contacts
 * @param {string} type
 * @returns {object}
 */
const getContactDetailsByContactType = ({ contacts }, type) => {
	let res = {};

	for (const contact of contacts) {
		const contactType = contact.type.toLowerCase();

		if (contactType === type) {
			res = {
				orgName: contact.organisationName || '',
				name: `${contact.firstName} ${contact.lastName}`,
				orgOrName: contact.organisationName
					? contact.organisationName
					: `${contact.firstName} ${contact.lastName}`,
				jobTitle: contact.jobTitle || '',
				under18: contact.under18 ? 'Yes' : 'No',
				email: contact.email || '',
				phoneNumber: contact.phoneNumber || '',
				preferredContact: '',
				addressLine1: contact.address.addressLine1 || '',
				addressLine2: contact.address.addressLine2 || '',
				town: contact.address.town || '',
				county: contact.address.county || '',
				postcode: contact.address.postcode || ''
			};
		}
	}

	return res;
};

/**
 * @param {string} date
 * @returns {string}
 */
const formatDate = (date) => format(new Date(date), 'dd MMM yyyy');

/**
 *
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
const createExcerpt = (text, maxLength) => {
	const lastSpaceIndex = text.lastIndexOf(' ', maxLength);

	return `${text.slice(0, Math.max(0, lastSpaceIndex))}...`;
};

/**
 *
 * @param {Representation} representation
 * @returns {object}
 */
const getRepresentationData = (representation) => {
	const maxRepTextLength = 200;

	let representationExcerpt = '';

	if (representation.originalRepresentation.length >= maxRepTextLength) {
		representationExcerpt = createExcerpt(representation.originalRepresentation, maxRepTextLength);
	}

	return {
		id: representation.id,
		reference: representation.reference,
		status: representation.status,
		redacted: representation.redacted,
		received: formatDate(representation.received),
		originalRepresentation: representation.originalRepresentation,
		redactedRepresentation: representation.redacted ? representation.redactedRepresentation : '',
		representationExcerpt
	};
};

// placeholder function
/**
 *
 * @param {*} data
 * @returns {object}
 */
const getWorkflowData = (data) => {
	return data;
};

// placeholder function
/**
 *
 * @param {*} data
 * @returns {object}
 */
const getAttachmentsData = (data) => {
	return data;
};

/**
 * @param {Representation} representation
 * @returns {object}
 */
export const getRepresentationDetailsViewModel = (representation) => {
	const viewData = {
		agentData: getContactDetailsByContactType(representation, 'agent'),
		personData: getContactDetailsByContactType(representation, 'person'),
		representationData: getRepresentationData(representation),
		workflowData: getWorkflowData(representation),
		attachmentsData: getAttachmentsData(representation)
	};

	return viewData;
};
