import { omitBy } from 'lodash-es';

/**
 * @typedef {import('../relevant-representation.types.js').Representation} Representation
 */
/**
 * @typedef {import('../relevant-representation.types.js').Contact} Contact
 */

/**
 *
 * @param {Contact} contact
 * @returns {object}
 */

export const formatContactDetails = (contact = {}) => ({
	id: contact.id,
	type: contact.type,
	organisationName: contact.organisationName || '',
	fullName: contact.firstName || contact.lastName ? `${contact.firstName} ${contact.lastName}` : '',
	firstName: contact.firstName,
	lastName: contact.lastName,
	jobTitle: contact.jobTitle || '',
	under18: contact.under18,
	email: contact.email || '',
	phoneNumber: contact.phoneNumber || '',
	contactMethod: contact.contactMethod || '',
	address: {
		addressLine1: contact.address?.addressLine1 || '',
		addressLine2: contact.address?.addressLine2 || '',
		town: contact.address?.town || '',
		postcode: contact.address?.postcode || '',
		country: contact.address?.country || ''
	}
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

/**
 *
 * @param {string} repType
 * @param {object} body
 * @returns {{json: object}}
 */
export const getRepresentationContactPayload = (repType, body) => ({
	json: { [repType]: stripEmptyStringKeyValueFromObject(body) }
});
