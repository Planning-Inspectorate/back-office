import { getTitles } from './utils/get-titles.js';

/**
 * @typedef {object|*} Locals
 * @property {boolean} isRepresented
 * @property {string} prefixBackLink
 */

/**
 * @param {object|*} query
 * @param {Locals} locals
 * @returns {object}
 */

export const getRepresentationTypeViewModel = ({ repMode }, { representation }) => ({
	...getTitles(repMode),
	backLinkUrl: representation.pageLinks.backLinkUrl,
	representationTypes: representationTypeOptions(representation)
});

/**
 * @typedef {object|*} repType
 * @property {string} value
 * @property {string} text
 * @property {boolean?} checked
 */

/**
 * @typedef {Array.<repType>} repTypes
 */

/**
 *
 * @param {object} rep
 * @param {string} rep.type
 * @return repTypes
 */
const representationTypeOptions = ({ type }) => {
	const listOfTypes = [
		{
			value: 'Local authorities',
			text: 'Local authorities',
			checked: false
		},
		{
			value: 'Members of the public/businesses',
			text: 'Members of the public/businesses',
			checked: false
		},
		{
			value: 'Non-statutory organisations',
			text: 'Non-statutory organisations',
			checked: false
		},
		{
			value: 'Statutory consultees',
			text: 'Statutory consultees',
			checked: false
		},
		{
			value: 'Parish councils',
			text: 'Parish councils',
			checked: false
		}
	];

	return listOfTypes.map((el) => {
		if (el.value === type) {
			el.checked = true;
		}
		return el;
	});
};
