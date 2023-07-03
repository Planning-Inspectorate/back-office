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
 * @property {string} representationExcerpt
 * @property {string} redactedRepresentation
 * @property {string} redactedRepresentationExcerpt
 * @property {string} redactedNotes
 * @property {string} redactedNotesExcerpt
 * @property {string} redactedBy
 * @property {string} type
 * @property {Attachment []}  attachments
 */

/**
 * @typedef {object} Address
 * @property {string|null} addressLine1
 * @property {string|null} addressLine2
 * @property {string|null} town
 * @property {string|null} postcode
 * @property {string|null} country
 */

/**
 * @typedef {object} Attachment
 * @property {string} filename
 * @property {string} documentGuid
 * @property {number} id
 */

/**
 * @typedef {object} Contact
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string|null} organisationName
 * @property {string|null} contactMethod
 * @property {string} type
 * @property {string|null} jobTitle
 * @property {boolean} under18
 * @property {string|null} email
 * @property {string|null} phoneNumber
 * @property {Address} address
 */

/**
 *
 * @param {boolean|null}under18
 * @return {string}
 */
const formatUnder18TypesToString = (under18) =>
	under18 === null ? 'Unknown' : under18 ? 'Yes' : 'No';
/**
 * @param {object} representation
 * @param {Contact[]} representation.contacts
 * @returns {object[]}
 */
const getContactDetailsByContactType = ({ contacts }) => {
	return contacts.map((contact) => ({
		type: contact.type,
		orgName: contact.organisationName || '',
		name: `${contact.firstName} ${contact.lastName}`,
		orgOrName: contact.organisationName
			? contact.organisationName
			: `${contact.firstName} ${contact.lastName}`,
		jobTitle: contact.jobTitle || '',
		under18: formatUnder18TypesToString(contact.under18),
		email: contact.email || '',
		phoneNumber: contact.phoneNumber || '',
		preferredContact: contact.contactMethod || '',
		addressLine1: contact.address?.addressLine1 || '',
		addressLine2: contact.address?.addressLine2 || '',
		town: contact.address?.town || '',
		postcode: contact.address?.postcode || '',
		country: contact.address?.country || ''
	}));
};

/**
 * @param {string} date
 * @returns {string}
 */
const formatDate = (date) => format(new Date(date), 'dd MMM yyyy');

const maxRepTextLength = 200;

/**
 *
 * @param {string} text
 * @returns {string}
 */
const getExcerpt = (text) =>
	text && text.length >= maxRepTextLength
		? `${text.slice(0, Math.max(0, text.lastIndexOf(' ', maxRepTextLength)))}`
		: '';

/**
 *
 * @param {Representation} representation
 * @returns {object}
 */
const getRepresentationData = (representation) => ({
	id: representation.id,
	reference: representation.reference,
	status: representation.status,
	redacted: representation.redacted,
	received: formatDate(representation.received),
	originalRepresentation: representation.originalRepresentation,
	redactedRepresentation: representation.redacted ? representation.redactedRepresentation : '',
	representationExcerpt: getExcerpt(representation.originalRepresentation),
	redactedRepresentationExcerpt: getExcerpt(representation.redactedRepresentation),
	redactedNotes: representation.redactedNotes,
	redactedNotesExcerpt: getExcerpt(representation.redactedNotes),
	redactedBy: representation.redactedBy,
	type: representation.type,
	attachments: representation.attachments
});

/**
 * @param {Representation} representation
 * @returns {{agentData: object, represented: object, representationData: object}}
 */
export const getRepresentationDetailsViewModel = (representation) => {
	const [represented, agentData] = getContactDetailsByContactType(representation);
	return {
		agentData,
		represented,
		representationData: getRepresentationData(representation)
	};
};
