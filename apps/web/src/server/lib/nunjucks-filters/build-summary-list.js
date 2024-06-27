/**
 * @typedef {({label: string, text?: string | undefined, html?: string | undefined, omitted?: boolean | undefined})[]} Items
 */

/**
 * Filter to convert an array of items into govukSummaryList rows.
 *
 * @param {Items} items
 * @returns {Record<any, any>[]}
 */
export const buildSummaryList = (items) =>
	items
		.filter(({ omitted }) => !omitted)
		.map(({ label, text, html }) => ({
			key: { text: label },
			value: { text, html },
			actions: {
				items: []
			}
		}));
