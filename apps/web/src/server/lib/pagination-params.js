/**
 * @typedef {object} DropdownItem
 * @property {number} value
 * @property {number} text
 * @property {boolean} selected
 */

/**
 * @typedef {object} Buttons
 * @property {{href: string}=} previous
 * @property {{href: string}=} next
 * @property {{number: number, href: string, current: boolean}[]} items
 */

/**
 * @typedef {object} PaginationParams
 * @property {DropdownItem[]} dropdownItems
 * @property {Buttons} buttons
 */

/**
 *
 * @param {number} size
 * @param {number} number
 * @param {number=} pageCount
 * @returns {PaginationParams}
 */
export const paginationParams = (size, number, pageCount) => {
	const paginationDropdownItems = [...Array.from({ length: 5 }).keys()].map((index) => ({
		value: (1 + index) * 25,
		text: (1 + index) * 25,
		selected: (1 + index) * 25 === size
	}));

	const paginationButtons = {
		...(number === 1 ? {} : { previous: { href: `?number=${number - 1}&size=${size}` } }),
		...(number === pageCount ? {} : { next: { href: `?number=${number + 1}&size=${size}` } }),
		items: [...Array.from({ length: pageCount || 0 }).keys()].map((index) => ({
			number: index + 1,
			href: `?number=${index + 1}&size=${size}`,
			current: index + 1 === number
		}))
	};

	return {
		dropdownItems: paginationDropdownItems,
		buttons: paginationButtons
	};
};
