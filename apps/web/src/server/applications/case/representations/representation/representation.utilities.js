import { isEmpty, omitBy } from 'lodash-es';

/**
 * @typedef {import('../relevant-representation.types.js').Representation} Representation
 */
/**
 * @typedef {import('../relevant-representation.types.js').Contact} Contact
 */

/**
 *
 * @param {Contact} contact
 * @returns {Record<string, any>}
 */

export const formatContactDetails = (contact = {}) => ({
	id: contact.id,
	organisationName: contact.organisationName?.trim() || '',
	fullName: `${contact.firstName?.trim() || ''} ${contact.lastName?.trim() || ''}`.trim(),
	firstName: contact.firstName?.trim() || '',
	lastName: contact.lastName?.trim() || '',
	jobTitle: contact.jobTitle?.trim() || '',
	under18: contact.under18,
	email: contact.email?.trim() || '',
	phoneNumber: contact.phoneNumber?.trim() || '',
	contactMethod: contact.contactMethod?.trim() || '',
	address: {
		addressLine1: contact.address?.addressLine1?.trim() || '',
		addressLine2: contact.address?.addressLine2?.trim() || '',
		town: contact.address?.town?.trim() || '',
		postcode: contact.address?.postcode?.trim() || '',
		country: contact.address?.country?.trim() || ''
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
 * @returns {Record<string, any>}
 */
export const getRepresentationContactPayload = (repType, body) => {
	// @ts-ignore
	const { type, ...attributes } = body;

	return {
		...(type ? { representedType: type } : {}),
		...(!isEmpty(attributes) ? { [repType]: stripEmptyStringKeyValueFromObject(attributes) } : {})
	};
};
