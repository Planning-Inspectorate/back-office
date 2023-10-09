import { buildHtmlLink, buildHtmSpan, buildHtmUnorderedList } from './tag-builders.js';
/**
 * @typedef {'text' | 'link' | 'unorderedList'} HtmlTagType
 * @typedef {import('./tag-builders.js').HtmlLink} HtmlLink
 */

/**
 * @typedef Row
 * @type {object}
 * @property {string} title - key column
 * @property {(string | Array<string|string[]> | HtmlLink[] | HtmlLink)} value - value column
 * @property {string} actionText - text for button
 * @property {string} actionLink - url for button
 * @property {HtmlTagType} valueType - determines html tags
 * @property {string} [actionVisuallyHiddenText] - additional text for button for screen readers
 */

/**
 * @typedef {{title: {text: string}}} Card Card for header
 * @typedef {{text: string}} Key Key column
 * @typedef {{html: string}} Value Value column
 * @typedef {{items: {href: string, text: string, visuallyHiddenText: string}[]}} Actions Array of button actions: [{button link, button text, button hidden text}]
 */

/**
 * @typedef {Object} BuilderParameters
 * @property {Row[]} rows
 * @property {string} [header]
 */

/**
 * @typedef {Object} SummaryListComponentParameters
 * @property {{key: Key, value: Value, actions: Actions}[]} rows
 * @property {Card} [card]
 */

/**
 * @param {BuilderParameters} params
 * @returns {SummaryListComponentParameters}
 */
export function generateSummaryList(params) {
	/** @type {SummaryListComponentParameters} */
	const componentParameters = {
		rows: params.rows.map((row) => ({
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
						visuallyHiddenText: row.actionVisuallyHiddenText || row.title
					}
				]
			}
		}))
	};

	if (params.header) {
		componentParameters.card = {
			title: {
				text: params.header
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
	const rowValues = Array.isArray(row.value) ? row.value : [row.value];

	switch (row.valueType) {
		case 'unorderedList': {
			// @ts-ignore
			return buildHtmUnorderedList(rowValues);
		}
		case 'link': {
			// @ts-ignore
			return rowValues.map((value) => buildHtmlLink(value)).join('<br>');
		}
		default: {
			return (
				rowValues
					// @ts-ignore
					.filter((value) => value?.length)
					// @ts-ignore
					.map((value) => buildHtmSpan(value))
					.join('<br>')
			);
		}
	}
}
