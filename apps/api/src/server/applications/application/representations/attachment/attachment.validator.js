import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../../../middleware/error-handler.js';

export const representationAddAttachmentValidator = composeMiddleware(
	body('documentId').exists().withMessage('is a required field'),
	validationErrorHandler
);
