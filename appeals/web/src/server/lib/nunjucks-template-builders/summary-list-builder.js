/**
 * @typedef {'text' | 'link' | 'unorderedList'} HtmlTagType
 */

/**
 * @typedef Row
 * @type {object}
 * @property {string} title - key column
 * @property {(string[] | string)} value - value column
 * @property {{[key: string]: string} | null} [attributes] - custom attributes
 * @property {string} actionText - text for button
 * @property {string} actionLink - url for button
 * @property {HtmlTagType} valueType - determines html tags
 */

/**
 * @typedef {{title: {text: string}}} Card Card for header
 * @typedef {{text: string}} Key Key column
 * @typedef {{html: string}} Value Value column
 * @typedef {{items: {href: string, text: string, visuallyHiddenText: string}[]}} Actions Array of button actions: [{button link, button text, button hidden text}]
 */

/**
 * @typedef {Object} BuilderParameters
 * @property {string} [header]
 * @property {Row[]} rows
 */

/**
 * @typedef {Object} SummaryListComponentParameters
 * @property {{key: Key, value: Value, actions: Actions}[]} rows
 * @property {Card} [card]
 */

/**
 * @param {Row[]} rows
 * @param {string} [header]
 * @returns {SummaryListComponentParameters}
 */
export function generateSummaryList(rows, header) {
	/** @type {SummaryListComponentParameters} */
	const componentParameters = {
		rows: rows.map((row) => ({
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
		}))
	};

	if (header) {
		componentParameters.card = {
			title: {
				text: header
			}
		};
	}

	return componentParameters;
}

/**
 * @param {Row} row
 * @returns {string}
 */
function formatRowValue(row) {
	let rowValueAsHtml = '';
	let htmlTags;

	if (Array.isArray(row.value)) {
		for (let i = 0; i < row.value.length; i++) {
			const value = row.value[i];
			htmlTags = getHtmlTags(row.valueType, value);
			rowValueAsHtml += `${htmlTags.startTag}${value}${htmlTags.endTag}${
				i < row.value.length - 1 && row.valueType !== 'unorderedList' ? '<br>' : ''
			}`;
		}
	} else if (row.attributes) {
		// @ts-ignore
		htmlTags = getHtmlAnchorWithAttributes(row.attributes);
		rowValueAsHtml = `${htmlTags.startTag}${row.value}${htmlTags.endTag}`;
	} else {
		htmlTags = getHtmlTags(row.valueType, row.value);
		rowValueAsHtml = `${htmlTags.startTag}${row.value}${htmlTags.endTag}`;
	}

	if (htmlTags?.wrappingStartTag && htmlTags?.wrappingEndTag) {
		rowValueAsHtml = `${htmlTags.wrappingStartTag}${rowValueAsHtml}${htmlTags.wrappingEndTag}`;
	}

	return rowValueAsHtml;
}

/**
 * @typedef {Object} HtmlTagsEntry
 * @property {string} startTag
 * @property {string} endTag
 * @property {string} [wrappingStartTag]
 * @property {string} [wrappingEndTag]
 */

/**
 * @param {HtmlTagType} type
 * @param {string} [href] optional: if type is link
 * @returns {HtmlTagsEntry}
 */
function getHtmlTags(type, href) {
	/**
	 * @type {Object<string, HtmlTagsEntry>}
	 */
	let determineHtmlTag = {
		text: { startTag: '<span>', endTag: '</span>' },
		link: { startTag: `<a href="${href}" class="govuk-link">`, endTag: `</a>` },
		unorderedList: {
			startTag: '<li>',
			endTag: '</li>',
			wrappingStartTag: '<ul class="govuk-!-margin-top-0 govuk-!-padding-left-0">',
			wrappingEndTag: '</ul>'
		}
	};

	return determineHtmlTag[type];
}

/**
 * @param {Object<string, string>} attributes
 * @returns {HtmlTagsEntry}
 */
function getHtmlAnchorWithAttributes(attributes) {
	const attrs = Object.keys(attributes)
		.map((a) => `${a}="${attributes[a]}"`)
		.join(' ');

	return {
		startTag: `<a ${attrs} class="govuk-link">`,
		endTag: `</a>`
	};
}
