import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';

export const validatePublishRepresentations = composeMiddleware(
	body('representationIds')
		.isArray({ min: 1 })
		.withMessage('at least 1 id must be provided')
		.custom((array) => array.every((value) => typeof value === 'number'))
		.withMessage('Must be an array of numbers'),
	body('actionBy').exists().withMessage('is a mandatory field'),
	validationErrorHandler
);
