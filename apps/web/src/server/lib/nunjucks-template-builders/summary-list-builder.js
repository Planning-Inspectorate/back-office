/**
 * @typedef {'span' | 'text' | 'link'} HtmlTagType
 */

/**
 * @typedef RowArray
 * @type {object}
 * @property {string} title - key column
 * @property {(string | string[])} value - value column
 * @property {HtmlTagType} valueType - determines html tags
 * @property {string} actionText - text for button
 * @property {string} actionLink - url for button
 */

/**
 * @typedef {{title: {text: string}}} Card Card for header
 * @typedef {{text: string}} Key Key column
 * @typedef {{html: string}} Value Value column
 * @typedef {{items: {href: string, text: string, visuallyHiddenText: string}[]}} Actions Array of button actions: [{button link, button text, button hidden text}]
 */

/**
 * @typedef {Object} BuilderParameters
 * @property {string} header
 * @property {RowArray[]} rows
 */

/**
 * @param {string} header
 * @param {RowArray[]} rowArray
 * @returns {{card: Card, rows: {key: Key, value: Value, actions: Actions}[]}}}
 */
export function generateSummaryList(header, rowArray) {
	const rows = [];
	for (const row of rowArray) {
		rows.push({
			key: {
				text: row.title
			},
			value: {
				html: formatRowValue(row)
			},
			actions: {
				items: [
					{
						href: row.actionLink,
						text: row.actionText,
						visuallyHiddenText: row.title
					}
				]
			}
		});
	}
	return {
		card: {
			title: {
				text: header
			}
		},
		rows: rows
	};
}

/**
 * @param {{ valueType: HtmlTagType; value: string | string[]; }} row
 */
function formatRowValue(row) {
	let rowValueAsHtml = '';
	if (Array.isArray(row.value)) {
		const arrayOfValues = row.value;
		for (const value of arrayOfValues) {
			const htmlTags = getHtmlTags(row.valueType, value);
			rowValueAsHtml += `${htmlTags.startTag}${value}${htmlTags.endTag}<br>`;
		}
	} else {
		const htmlTags = getHtmlTags(row.valueType, row.value);
		rowValueAsHtml = `${htmlTags.startTag}${row.value}${htmlTags.endTag}`;
	}
	return rowValueAsHtml;
}

/**
 * @param {HtmlTagType} type
 * @param {string} [href] optional: if type is link
 * @returns {{startTag: string, endTag: string}} <{{startTag}}>, </{{endTag}}>
 */
function getHtmlTags(type, href) {
	/**
	 * @type {Object<string, {startTag: string, endTag: string}>}
	 */
	let determineHtmlTag = {
		text: { startTag: '<span>', endTag: '</span>' },
		link: { startTag: `<a href="${href}" class="govuk-link">`, endTag: `</a>` }
	};

	return determineHtmlTag[type];
}
