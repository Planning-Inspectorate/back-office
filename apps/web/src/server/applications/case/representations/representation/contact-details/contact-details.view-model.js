import { getRepTypePageTitles } from '../utils/get-rep-type-page-titles.js';

const titles = {
	represented: {
		default: 'Contact details',
		change: 'Change contact details'
	},
	representative: {
		default: 'Add agent contact details',
		change: 'Change agent contact details'
	}
};

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
	...getRepTypePageTitles(repType, repMode, titles),
	backLinkUrl: representation.pageLinks.backLinkUrl,
	pageKey: repType
});
