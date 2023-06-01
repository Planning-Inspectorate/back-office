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

export const getRepresentationTypeViewModel = (
	{ repType, repId },
	{ prefixBackLink, representation }
) => ({
	backLinkUrl: `${prefixBackLink}/contact-method?repType=${repType}&repId=${repId}`,
	pageTitle: 'Representation type',
	pageHeading: 'Representation type',
	representationTypes: getListOfTypes(representation)
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
const getListOfTypes = ({ type }) => {
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
