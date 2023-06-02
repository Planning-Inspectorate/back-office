/**
 * @param {object} representation
 * @param {string} representation.contactMethod
 * @returns {Array<object>} contactMethodOptions array
 */
const getContactMethodOptions = ({ contactMethod }) => {
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
export const getContactMethodViewModel = (
	{ repType, repId },
	{ prefixBackLink, representation }
) => ({
	backLinkUrl: `${prefixBackLink}/address-details?repType=${repType}&repId=${repId}`,
	pageKey: repType,
	pageTitle: 'Preferred contact method',
	contactMethodOptions: getContactMethodOptions(representation[repType])
});
