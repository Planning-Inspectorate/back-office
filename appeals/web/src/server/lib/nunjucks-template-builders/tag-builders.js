/**
 * @typedef HtmlLink
 * @type {object}
 * @property {string} title
 * @property {string} href
 * @property {string} [target]
 */

/**
 * @param {HtmlLink} link
 * @returns {string}
 */
export const buildHtmlLink = (link) => {
	return [
		`<a href="${link.href}"`,
		link.target ? ` target="${link.target}"` : '',
		' class="govuk-link">',
		link.title,
		'</a>'
	].join('');
};

/**
 * @param {Array<string|string[]>} items
 * @param {number} [recursionDepth]
 * @returns {string}
 */
export const buildHtmUnorderedList = (items, recursionDepth = 0) => {
	const listItems = items
		.map(
			(item) =>
				`<li>${Array.isArray(item) ? buildHtmUnorderedList(item, recursionDepth + 1) : item}</li>`
		)
		.join('');
	return `<ul class="${
		recursionDepth === 0 ? 'govuk-list govuk-!-margin-top-0 govuk-!-padding-left-0' : ''
	}">${listItems}</ul>`;
};

/**
 * @param {string} text
 * @returns {string}
 */
export const buildHtmSpan = (text) => {
	return `<span>${text}</span>`;
};
