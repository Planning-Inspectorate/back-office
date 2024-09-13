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
	let isChecked = false;
	const items = source.map((sourceItem) => {
		const value = typeof sourceItem === 'object' ? sourceItem[options.valueKey] : sourceItem;
		const text = typeof sourceItem === 'object' ? sourceItem[options.labelKey] : sourceItem;
		const checked = typeof sourceItem === 'object' ? value === options.selectedValue : sourceItem;

		if (checked) {
			isChecked = true;
		}

		return {
			value,
			text,
			checked: checked,
			selected: checked
		};
	});

	if (!isChecked) {
		// Set default if there is any
		const itemIndex = source.findIndex((sourceItem) =>
			typeof sourceItem === 'object' ? sourceItem.checked : false
		);
		if (itemIndex > -1) {
			items[itemIndex].selected = true;
			items[itemIndex].checked = true;
		}
		console.log(itemIndex);
	}

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
