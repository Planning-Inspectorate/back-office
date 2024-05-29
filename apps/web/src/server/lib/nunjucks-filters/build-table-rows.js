/**
 * @typedef {({label: string, text?: string | undefined, html?: string | undefined, omitted?: boolean | undefined})[]} Items
 * @typedef {Record<any, any>[]} TableRow
 */

/**
 * Filter to convert an array of items into govukTable rows.
 *
 * @param {Items} items
 * @returns {TableRow[]}
 */
export const buildTableRows = (items) =>
	items
		.filter(({ omitted }) => !omitted)
		.map(({ label, text, html }) => {
			const /** @type TableRow */ row = [{ text: label }];
			row.push(html ? { html } : { text });
			return row;
		});
