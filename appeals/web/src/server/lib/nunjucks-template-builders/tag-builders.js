/**
 * @typedef HtmlLink
 * @type {object}
 * @property {string} title
 * @property {string} href
 * @property {string?} target
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
 * @param {string[]} items
 * @returns {string}
 */
export const buildHtmUnorderedList = (items) => {
	const listItems = items.map((i) => `<li>${i}</li>`).join('');
	return `<ul class="govuk-list govuk-!-margin-top-0 govuk-!-padding-left-0">${listItems}</ul>`;
};

/**
 * @param {string} text
 * @returns {string}
 */
export const buildHtmSpan = (text) => {
	return `<span>${text}</span>`;
};
