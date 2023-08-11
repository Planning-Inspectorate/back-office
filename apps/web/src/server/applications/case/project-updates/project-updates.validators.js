import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

export const validateProjectUpdatesContent = createValidator(
	body('backOfficeProjectUpdateContent')
		.trim()
		.custom((value) => htmlToText(decodeURI(value)).length > 12)
		.withMessage('The project update needs to be at least 12 characters long')
);

/**
 * Remove HTML tags from a string
 *
 * @param {string} html
 * @returns {string}
 */
function htmlToText(html) {
	return sanitizeHtml(html, {
		allowedTags: [] // with no allowed tags, they are all removed, leaving text
	});
}
