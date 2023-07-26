import { buildHtmlLink, buildHtmSpan, buildHtmUnorderedList } from './tag-builders.js';
/**
 * @typedef {'text' | 'link' | 'unorderedList'} HtmlTagType
 * @typedef {import('./tag-builders.js').HtmlLink} HtmlLink
 */

/**
 * @typedef Row
 * @type {object}
 * @property {string} title - key column
 * @property {(string[] | string | HtmlLink[] | HtmlLink)} value - value column
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
 * @property {Row[]} rows
 * @property {string} [header]
 */

/**
 * @typedef {Object} SummaryListComponentParameters
 * @property {{key: Key, value: Value, actions: Actions}[]} rows
 * @property {Card} [card]
 */

// TODO - refactor generateSummaryList to accept single parameter of type BuilderParameters, then update callers as required
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
			// @ts-ignore
			return rowValues
				.filter((value) => value?.length)
				.map((value) => buildHtmSpan(value))
				.join('<br>');
		}
	}
}
