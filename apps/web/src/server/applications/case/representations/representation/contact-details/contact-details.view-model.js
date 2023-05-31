/**
 * @typedef {object|*} Locals
 * @property {boolean} isRepresented
 * @property {string} prefixBackLink
 */

/**
 * @param {string} repType
 * @param {Locals} locals
 * @returns {object}
 */

export const getContactDetailsViewModel = (repType, { isRepresented, prefixBackLink }) => ({
	backLinkUrl: isRepresented
		? prefixBackLink
		: `${prefixBackLink}/representation-entity?repType=${repType}`,
	pageKey: repType,
	pageTitle: isRepresented ? 'Add contact details' : 'Add agent contact details',
	pageHeading: isRepresented ? 'Contact details' : 'Agent contact details'
});
