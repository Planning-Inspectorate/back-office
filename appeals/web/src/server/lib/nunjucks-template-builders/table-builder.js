/**
 * @typedef {Object<string, string>} AttributesParameter
 */

/**
 * @typedef {Object} TableCell
 * @property {string} [text]
 * @property {string} [html]
 * @property {string} [format]
 * @property {string[]} [classes]
 * @property {string} [colspan]
 * @property {string} [rowspan]
 * @property {AttributesParameter} [attributes]
 */

/**
 * @typedef {Object} TableComponentParameters
 * @property {TableCell[]} head
 * @property {TableCell[][]} rows
 * @property {boolean} [firstCellIsHeader]
 */

/**
 * @typedef {string[]} Row
 */

/**
 * @typedef {Object} BuilderParameters
 * @property {Row} headings
 * @property {Row[]} rows
 * @property {boolean} [firstCellIsHeader]
 */

/**
 * @param {BuilderParameters} builderParameters
 * @returns {TableComponentParameters}
 */
export function generateTable(builderParameters) {
	const componentParameters = {
		head: builderParameters.headings.map((heading) => ({
			text: heading
		})),
		rows: builderParameters.rows.map((row) =>
			row.map((cell) => ({
				html: cell
			}))
		),
		...(builderParameters.firstCellIsHeader && {
			firstCellIsHeader: true
		})
	};

	return componentParameters;
}
