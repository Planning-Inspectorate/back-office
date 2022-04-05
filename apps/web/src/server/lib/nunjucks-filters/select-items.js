/**
 * @typedef {Object} SelectItem
 * @property {string} value - Value for the option item.
 * @property {string} text - Text for the option item.
 * @property {boolean} selected - Sets the option as the selected.
 * @property {boolean} disabled - Sets the option item as disabled.
 * @property {Object} attributes - 	HTML attributes (for example data attributes) to add to the option.
 */

/**
 * @typedef {Object} FilterOptions
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
 * @param {Object.<string, any>[] | string[]} source - Original array of source
 * data
 * @param {FilterOptions} options - The filter options.
 * @returns {SelectItem[]} - A collection of items compatible with `govukSelect`.
 */
export function selectItems(source, options) {
	const items = source.map((sourceItem) => {
		const value = typeof sourceItem === 'object' ? sourceItem[options.valueKey] : sourceItem;
		const text = typeof sourceItem === 'object' ? sourceItem[options.labelKey] : sourceItem;

		return {
			value,
			text,
			selected: value === options.selectedValue
		};
	});

	if (options.placeholder) {
		return [
			{ value: '', text: options.placeholder, selected: options.selectedValue === '' },
			...items
		];	
	}
	return items;
}
