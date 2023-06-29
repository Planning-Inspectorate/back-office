import { getPageTitles } from '../utils/get-page-titles.js';

const titles = {
	default: 'Under 18',
	change: 'Change representation age'
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

export const getRepresentationTypeViewModel = ({ repMode, repType }, { representation }) => ({
	...getPageTitles(repMode, titles),
	backLinkUrl: representation.pageLinks.backLinkUrl,
	name: 'under18',
	radioItems: getListOfOptions(representation[repType])
});

/**
 * @typedef {object} repType
 * @property {string} value
 * @property {string} text
 * @property {boolean?} checked
 */

/**
 * @typedef {Array.<repType>} repTypes
 */

const listOfRadioOptions = [
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
];

/**
 *
 * @param {object} rep
 * @param {boolean?} rep.under18
 * @return repTypes
 */
export const getListOfOptions = ({ under18 }) => {
	const under18Options = JSON.parse(JSON.stringify(listOfRadioOptions));

	return under18Options.map(
		(/** @type {{ value: boolean | null; checked: boolean; }} */ option) => {
			if (option.value === under18) option.checked = true;
			return option;
		}
	);
};
