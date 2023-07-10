/**
 * @typedef {import("../../appeals/appeals.types").CheckboxItemParameter} CheckboxItemParameter
 */

/**
 * Adds the provided html to the 'conditional' property of each item in the provided checkbox/radio 'items' parameter object whose 'propertyToCheck' is equal to 'valueToCheckFor'
 *
 * @param {CheckboxItemParameter[]} itemParameters
 * @param {'value'|'text'} propertyToCheck
 * @param {any} valueToCheckFor
 * @param {string} conditionalHtml
 * @returns {CheckboxItemParameter[]}
 */
export const checkboxItemParameterAddConditionalHtml = (
	itemParameters,
	propertyToCheck,
	valueToCheckFor,
	conditionalHtml
) => {
	for (let i = 0; i < itemParameters.length; i++) {
		if (itemParameters[i][propertyToCheck] === valueToCheckFor) {
			itemParameters[i].conditional = {
				html: conditionalHtml
			};
		}
	}

	return itemParameters;
};
