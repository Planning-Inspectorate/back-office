import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';

export const validateCreateNotificationLogs = composeMiddleware(
	body().isArray().withMessage('body must be an array'),
	body('*.projectUpdateId')
		.notEmpty()
		.withMessage('projectUpdateId is required')
		.toInt()
		.isInt()
		.withMessage('projectUpdateId must be a number'),
	body('*.subscriptionId')
		.notEmpty()
		.withMessage('subscriptionId is required')
		.toInt()
		.isInt()
		.withMessage('subscriptionId must be a number'),
	body('*.entryDate')
		.notEmpty()
		.withMessage('entryDate is required')
		.isISO8601({ strict: true, strictSeparator: true })
		.withMessage('entryDate must be a valid date'),
	body('*.emailSent')
		.notEmpty()
		.withMessage('emailSent is required')
		.isBoolean()
		.withMessage('emailSent must be a boolean'),
	body('*.functionInvocationId')
		.notEmpty()
		.withMessage('functionInvocationId is required')
		.isString()
		.withMessage('functionInvocationId must be a string'),
	validationErrorHandler
);
