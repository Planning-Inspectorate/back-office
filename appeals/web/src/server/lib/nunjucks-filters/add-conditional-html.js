/**
 * Adds the provided html to the 'conditional' property of the provided "item" object
 *
 * @param {Object<any, any>} item
 * @param {string} conditionalHtml
 * @returns {Object}
 */
export const addConditionalHtml = (item, conditionalHtml) => {
	item.conditional = {
		html: conditionalHtml
	};

	return item;
};
