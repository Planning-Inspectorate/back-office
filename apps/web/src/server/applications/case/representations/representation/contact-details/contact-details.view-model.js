import { getTitles } from './utils/get-titles.js';

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

export const getContactDetailsViewModel = ({ repType, repMode }, { representation }) => ({
	...getTitles(repType, repMode),
	backLinkUrl: representation.pageLinks.backLinkUrl,
	pageKey: repType
});
