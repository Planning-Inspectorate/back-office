/**
 * @typedef {import('../../relevant-representation.types.js').Contact} Contact
 */

/**
 * @param {Contact} contact
 * @return {string|null|undefined}
 */
export const getOrganisationOrFullname = ({ organisationName, fullName }) =>
	organisationName || fullName;
