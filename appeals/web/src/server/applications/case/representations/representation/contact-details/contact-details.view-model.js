/**
 * @typedef {object|*} Locals
 * @property {boolean} isRepresented
 * @property {string} prefixBackLink
 */

/**
 * @typedef {object|*} Query
 * @property {string} repType
 * @property {string} repId
 */

/**
 * @param {Query} query
 * @param {Locals} locals
 * @returns {object}
 */

export const getContactDetailsViewModel = (
	{ repType, repId },
	{ isRepresented, prefixBackLink }
) => ({
	backLinkUrl: isRepresented
		? prefixBackLink
		: `${prefixBackLink}/representation-entity?repType=${repType}&repId=${repId}`,
	pageKey: repType,
	pageTitle: isRepresented ? 'Add contact details' : 'Add agent contact details',
	pageHeading: isRepresented ? 'Contact details' : 'Agent contact details'
});
