import { prettyPrint } from 'html';
import htmlParser from 'node-html-parser';

/**
 * Parses HTML and returns a root element.
 *
 * @param {string} html
 * @param {Partial<import('node-html-parser').Options> & { rootElement?: string }} [options={}]
 * @returns {HTMLElement}
 */
export const parseHtml = (html, { rootElement = 'main', ...options } = {}) => {
	const prettifiedHtml = prettyPrint(
		/** @type {*} */ (htmlParser)
			.parse(html)
			.removeWhitespace()
			.querySelector(rootElement)
			.toString()
	);

	return /** @type {*} */ (htmlParser).parse(prettifiedHtml, options);
};
