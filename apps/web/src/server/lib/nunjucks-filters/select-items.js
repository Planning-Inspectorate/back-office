/**
 * @typedef {object} SelectItem
 * @property {string} value
 * @property {string} text
 * @property {boolean=} checked
 * @property {boolean} selected
 * @property {boolean=} disabled
 * @property {object=} attributes
 */

/**
 * @typedef {object} FilterOptions
 * @property {string} valueKey - The property of a source item that uniquely
 * identifies it. Only applies where source is an array of objects.
 * @property {string} labelKey - The property of a source item used to display
 * as its label. Only applies where source is an array of objects.
 * @property {string=} selectedValue - The value currently selected.
 * @property {string=} placeholder - A label belonging to an empty value in the
 * options. For example, 'Select an item'.
 */

/**
 * From a collection of values, onstruct a collection of items compatible with
 * the `govukSelect` component.
 *
 * @param {Object<any, any>[] | string[]} source
 * @param {FilterOptions} options
 * @returns {SelectItem[]}
 */
export function selectItems(source, options) {
	const items = source.map((sourceItem) => {
		const value = typeof sourceItem === 'object' ? sourceItem[options.valueKey] : sourceItem;
		const text = typeof sourceItem === 'object' ? sourceItem[options.labelKey] : sourceItem;

		return {
			value,
			text,
			checked: value === options.selectedValue,
			selected: value === options.selectedValue
		};
	});

	if (options.placeholder) {
		return [
			{
				value: '',
				text: options.placeholder,
				selected: options.selectedValue === ''
			},
			...items
		];
	}
	return items;
}
