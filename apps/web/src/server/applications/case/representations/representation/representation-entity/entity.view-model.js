/**
 * @param {object} representation
 * @param {object} representation.representative
 * @param {string|*} representation.representative.id
 * @param {object} representation.represented
 * @param {string|null} representation.represented.type
 * @returns {Array<object>} contactMethodOptions array
 */
const getRepresentationEntityOptions = (representation) => {
	const optionsList = [
		{
			value: 'PERSON',
			text: 'An individual',
			checked: false
		},
		{
			value: 'ORGANISATION',
			text: 'An organisation',
			checked: false
		},
		{
			value: 'AGENT',
			text: 'A representative on behalf of another person, family group or organisation',
			checked: false
		}
	];

	const type = representation.representative.id ? 'AGENT' : representation.represented.type;

	return optionsList.map((option) => {
		if (option.value === type) {
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
export const getRepresentationEntityViewModel = (
	{ repType, repId },
	{ prefixBackLink, representation }
) => ({
	backLinkUrl: `${prefixBackLink}/under-18?repType=${repType}&repId=${repId}`,
	pageKey: repType,
	pageTitle: 'Representation entity',
	representationEntityOptions: getRepresentationEntityOptions(representation)
});
