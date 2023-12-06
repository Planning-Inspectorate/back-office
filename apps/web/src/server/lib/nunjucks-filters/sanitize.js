import sanitizeHtml from 'sanitize-html';

/**
 *
 * @param {string} html
 * @param {any} options
 * @returns
 */
export const sanitize = (html, options = {}) => {
	return sanitizeHtml(html, options);
};
