/**
 * Builds a GovUK table from the given items.
 *
 * @param {Object} params
 * @param {string[]} [params.headers] - Table headers
 * @param {Array<Array<{ text?: string, html?: string }>>} params.rows - Table rows
 * @param {string} [params.caption] - Optional caption
 * @param {boolean} [params.firstCellIsHeader] - Whether first cell is header
 * @returns {{
 *   firstCellIsHeader: boolean,
 *   rows: Array<Array<{ text?: string, html?: string }>>,
 *   head?: Array<{ text: string }>,
 *   caption?: string
 * }}
 */
export function buildTable({ headers = [], rows, caption = '', firstCellIsHeader = false }) {
	/** @type {{
	 *   firstCellIsHeader: boolean,
	 *   rows: Array<Array<{ text?: string, html?: string }>>,
	 *   head?: Array<{ text: string }>,
	 *   caption?: string
	 * }} */
	const table = {
		firstCellIsHeader,
		rows: rows.map(
			/** @param {Array<{ text?: string, html?: string }>} row */
			(row) =>
				row.map(
					/** @param {{ text?: string, html?: string }} cell */
					(cell) => (cell.html ? { html: cell.html } : { text: cell.text || '' })
				)
		)
	};

	if (headers.length) {
		table.head = headers.map(
			/** @param {string} header */
			(header) => ({ text: header })
		);
	}

	if (caption.length) {
		table.caption = caption;
	}

	return table;
}
