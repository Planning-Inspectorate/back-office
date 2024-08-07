import { composeMiddleware } from '@pins/express';
import { body, param, query } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';
import sanitizeHtml from 'sanitize-html';
import { ProjectUpdate } from '@pins/applications/lib/application/project-update.js';

export const allowedTags = ['a', 'br', 'strong', 'ul', 'li', 'p'];
export const allowedTagsList = allowedTags.map((t) => `<${t}>`).join(' ');
export const htmlContentError = `htmlContent can only contain ${allowedTagsList} tags`;
export const htmlContentWelshError = `htmlContentWelsh can only contain ${allowedTagsList} tags`;
const statusList = ProjectUpdate.StatusList.map((s) => `'${s}'`).join(', ');
export const statusError = `status must be one of ${statusList}`;
const typesList = ProjectUpdate.TypesList.map((t) => `'${t}'`).join(', ');
export const typesError = `type must be one of ${typesList}`;

export const validateProjectUpdateFilters = composeMiddleware(
	query('status').optional().isIn(ProjectUpdate.StatusList).withMessage(statusError),
	query('publishedBefore')
		.optional()
		.isISO8601({ strict: true, strictSeparator: true })
		.withMessage(`publishedBefore must be a valid date`),
	query('sentToSubscribers')
		.optional()
		.isBoolean()
		.withMessage(`sentToSubscribers must be a boolean`),
	validationErrorHandler
);

export const validateCreateProjectUpdate = composeMiddleware(
	body('emailSubscribers')
		.notEmpty()
		.withMessage('emailSubscribers is required')
		.isBoolean()
		.withMessage('emailSubscribers must be a boolean'),
	body('status')
		.notEmpty()
		.withMessage('status is required')
		.isIn(ProjectUpdate.StatusList)
		.withMessage(statusError),
	body('htmlContent')
		.notEmpty()
		.withMessage('htmlContent is required')
		.isString()
		.withMessage('htmlContent must be a string')
		.custom(contentIsSafe)
		.withMessage(htmlContentError),
	body('title').optional().isString().withMessage('title must be a string'),
	body('htmlContentWelsh')
		.optional()
		.isString()
		.withMessage('htmlContentWelsh must be a string')
		.custom(contentIsSafe)
		.withMessage(htmlContentWelshError),
	validationErrorHandler
);

export const validateProjectUpdateId = composeMiddleware(
	param('projectUpdateId').toInt().isInt().withMessage('project update id must be a number'),
	validationErrorHandler
);

export const validateUpdateProjectUpdate = composeMiddleware(
	body('emailSubscribers').optional().isBoolean().withMessage('emailSubscribers must be a boolean'),
	body('status').optional().isIn(ProjectUpdate.StatusList).withMessage(statusError),
	body('htmlContent')
		.optional()
		.isString()
		.withMessage('htmlContent must be a string')
		.custom(contentIsSafe)
		.withMessage(htmlContentError),
	body('title').optional().isString().withMessage('title must be a string'),
	body('htmlContentWelsh')
		.optional()
		.isString()
		.withMessage('htmlContentWelsh must be a string')
		.custom(contentIsSafe)
		.withMessage(htmlContentWelshError),
	body('type')
		.optional()
		.isString()
		.withMessage('type must be a string')
		.isIn(ProjectUpdate.TypesList)
		.withMessage(typesError),
	body('sentToSubscribers')
		.optional()
		.isBoolean()
		.withMessage('sentToSubscribers must be a boolean'),
	validationErrorHandler
);

/**
 * Check that HTML content is safe, with very restricted tags allowed for project updates.
 *
 * @param {string} content
 * @returns {boolean}
 */
export function contentIsSafe(content) {
	const sanitized = sanitizeHtml(content, {
		allowedTags,
		allowedAttributes: {
			a: ['href']
		},
		allowedSchemes: ['https', 'mailto']
	});
	// if the sanitized content differs, then it's not considered safe
	return sanitized === content;
}
