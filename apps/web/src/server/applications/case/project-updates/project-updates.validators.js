import { createValidator } from '@pins/express';
import { body } from 'express-validator';
import sanitizeHtml from 'sanitize-html';

/** @typedef {import('express').RequestHandler} RequestHandler */

export const validateProjectUpdatesContent = createValidator(
	body('backOfficeProjectUpdateContent')
		.trim()
		.custom((value) => htmlToText(decodeURI(value)).length !== 0)
		.withMessage('Enter details about the update')
		.custom((value) => htmlToText(decodeURI(value)).length > 12)
		.withMessage('Details about the update must be 12 characters or more')
);

/**
 * Only validates backOfficeProjectUpdateContentWelsh if the case is Welsh
 *
 * @type{RequestHandler}
 */
export const validateProjectUpdatesContentWelsh = (req, res, next) => {
	const { caseIsWelsh = false } = res.locals || {};
	if (caseIsWelsh) {
		// @ts-ignore
		return createValidator(
			body('backOfficeProjectUpdateContentWelsh')
				.trim()
				.custom((value) => htmlToText(decodeURI(value)).length !== 0)
				.withMessage('Enter details about the update in Welsh')
				.custom((value) => htmlToText(decodeURI(value)).length > 12)
				.withMessage('Details about the update in Welsh must be 12 characters or more')
		)(req, res, next);
	}
	next();
};

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
