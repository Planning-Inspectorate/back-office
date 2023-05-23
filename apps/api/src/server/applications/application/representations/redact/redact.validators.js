import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandlerMissing } from '../../../../middleware/error-handler.js';

const validTypes = ['REDACTION', 'STATUS', 'REDACT_STATUS'];

export const validateRedactedRepresentation = composeMiddleware(
	body('type').optional().isIn(validTypes).withMessage(`Must be a valid type of: ${validTypes}`),
	body('actionBy').exists().withMessage('is a mandatory field'),
	body('redactedRepresentation').exists().withMessage('is a mandatory field'),
	validationErrorHandlerMissing
);
