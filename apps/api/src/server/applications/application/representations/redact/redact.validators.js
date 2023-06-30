import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import { validationErrorHandler } from '../../../../middleware/error-handler.js';

const validTypes = ['REDACTION', 'STATUS', 'REDACT_STATUS'];

export const validateRedactedRepresentation = composeMiddleware(
	body('type').optional().isIn(validTypes).withMessage(`Must be a valid type of: ${validTypes}`),
	body('actionBy').exists().withMessage('is a mandatory field'),
	body('redactedRepresentation').custom((value, { req: { body } }) => {
		if (!('redactedRepresentation' in body)) {
			if (!('redactStatus' in body)) throw new Error('is a mandatory field');
		}

		return true;
	}),
	body('redactStatus').optional().isBoolean(),
	validationErrorHandler
);
