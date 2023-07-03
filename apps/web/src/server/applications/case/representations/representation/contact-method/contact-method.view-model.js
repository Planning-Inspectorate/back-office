import { getRepTypePageTitles } from '../utils/get-rep-type-page-titles.js';

const titles = {
	represented: {
		default: 'Preferred contact method',
		change: 'Change contact method'
	},
	representative: {
		default: 'Preferred agent contact method',
		change: 'Change agent contact method'
	}
};

/**
 * @typedef {object} ContactMethodOption
 * @property {string} value
 * @property {string} text
 * @property {boolean} checked
 */

/**
 * @param {object} representation
 * @param {string} representation.contactMethod
 * @returns {Array<ContactMethodOption>} contactMethodOptions array
 */
export const getContactMethodOptions = ({ contactMethod }) => {
	const optionsList = [
		{
			value: 'email',
			text: 'Email',
			checked: false
		},
		{
			value: 'post',
			text: 'Post',
			checked: false
		}
	];

	return optionsList.map((option) => {
		if (option.value === contactMethod) {
			option.checked = true;
		}
		return option;
	});
};
/**
 * @typedef {object|*} Locals
 * @property {string} prefixBackLink
 * @property {string} pageKey
 * @property {string} pageTitle
 * @property {string} pageHeading
 * @property {Array<object>} contactMethodOptions
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
export const getContactMethodViewModel = ({ repType, repMode }, { representation }) => ({
	...getRepTypePageTitles(repType, repMode, titles),
	backLinkUrl: representation.pageLinks.backLinkUrl,
	pageKey: repType,
	contactMethodOptions: getContactMethodOptions(representation[repType])
});
