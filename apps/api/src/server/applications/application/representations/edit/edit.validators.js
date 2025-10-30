import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '#middleware/error-handler.js';

export const validateEditedRepresentation = composeMiddleware(
	body('editedRepresentation').trim().notEmpty().withMessage('is a mandatory field'),
	body('actionBy').exists().withMessage('is a mandatory field'),
	validationErrorHandler
);
