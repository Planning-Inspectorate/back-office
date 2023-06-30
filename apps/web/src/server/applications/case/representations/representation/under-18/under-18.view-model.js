import { getPageTitles } from '../utils/get-page-titles.js';

const titles = {
	default: 'Under 18',
	change: 'Change representation age'
};

/**
 * @typedef {object|*} Query
 * @property {string} repType
 * @property {string} repId
 */

/**
 * @typedef {object|*} Locals
 * @property {boolean} isRepresented
 * @property {string} prefixBackLink
 */

/**
 * @param {Query} query
 * @param {Locals} locals
 * @returns {object}
 */

export const getRepresentationTypeViewModel = ({ repMode, repType }, { representation }) => ({
	...getPageTitles(repMode, titles),
	backLinkUrl: representation.pageLinks.backLinkUrl,
	name: 'under18',
	radioItems: getListOfOptions(representation[repType])
});

/**
 * @typedef {object} repType
 * @property {boolean?} value
 * @property {string} text
 * @property {boolean?} checked
 */

/**
 *
 * @param {object} rep
 * @param {boolean?} rep.under18
 * @return {Array<repType>}
 */
export const getListOfOptions = ({ under18 }) =>
	[
		{
			value: true,
			text: 'Yes',
			checked: false
		},
		{
			value: false,
			text: 'No',
			checked: false
		},
		{
			value: null,
			text: 'Unknown',
			checked: false
		}
	].map((option) => {
		if (option.value === under18) option.checked = true;
		return option;
	});
