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
	backLinkUrl: `${prefixBackLink}/representation-type?repType=${repType}&repId=${repId}`,
	pageTitle: 'Under 18',
	pageHeading: 'Under 18',
	name: 'under18',
	radioItems: getListOfOptions(representation[repType])
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
 * @param {boolean?} rep.under18
 * @return repTypes
 */
const getListOfOptions = ({ under18 = null }) => {
	const listOfTypes = [
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

	console.log('Under 18 ', under18);

	return listOfTypes.map((el) => {
		if (el.value === under18) {
			el.checked = true;
		}
		return el;
	});
};
