import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';

export const validateUnpublishRepresentations = composeMiddleware(
	body('actionBy').exists().withMessage('is a mandatory field'),
	validationErrorHandler
);
