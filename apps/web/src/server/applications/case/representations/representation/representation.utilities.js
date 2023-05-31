import { omitBy } from 'lodash-es';
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
 * @property {string|null} [firstName]
 * @property {string|null} [lastName]
 * @property {string|null} [organisationName]
 * @property {string} [type]
 * @property {string|null} [jobTitle]
 * @property {boolean} [under18]
 * @property {string|null} [email]
 * @property {string|null} [phoneNumber]
 * @property {Address} [address]
 */

/**
 *
 * @param {Contact} contact
 * @returns {object}
 */

export const formatContactDetails = (contact = {}) => ({
	organisationName: contact.organisationName || '',
	fullName: `${contact.firstName} ${contact.lastName}`,
	firstName: contact.firstName,
	lastName: contact.lastName,

	jobTitle: contact.jobTitle || '',
	under18: contact.under18,
	email: contact.email || '',
	phoneNumber: contact.phoneNumber || '',
	preferredContact: '',
	addressLine1: contact.address?.addressLine1 || '',
	addressLine2: contact.address?.addressLine2 || '',
	town: contact.address?.town || '',
	county: contact.address?.county || '',
	postcode: contact.address?.postcode || ''
});

/**
 *
 * @param {string} url relative page url
 * @param {string} repId representation Id
 * @param {string} repType representation contact type (represented or representative)
 * @returns {string}
 */
export const getRepresentationPageUrl = (url, repId, repType) =>
	`${url}?repId=${repId}&repType=${repType}`;

/**
 *
 * @param {object} representation
 * @param {*} body
 * @param {string}repType
 * @returns {object}
 */
export const replaceRepresentaionValuesAsBodyValues = (representation, body, repType) => {
	return {
		representation: {
			...representation,
			[repType]: {
				...formatContactDetails(body)
			}
		}
	};
};
/**
 *
 * @param {*} errors
 * @returns {object}
 */
export const getFormattedErrorSummary = (errors) =>
	Object.keys(errors).map((error) => ({
		text: errors[error].msg,
		href: `#${error}`
	}));

/**
 *
 * @param {object} obj
 * @returns {object}
 */
const stripEmptyStringKeyValueFromObject = (obj) => omitBy(obj, (v) => v === '');
// object.fromEntries(Object.entries(obj).filter(([_, v]) => v != ''));
/**
 *
 * @param {string} repType
 * @param {object} body
 * @returns {{json: object}}
 */
export const getRepresentationContactPayload = (repType, body) => ({
	json: { [repType]: stripEmptyStringKeyValueFromObject(body) }
});
