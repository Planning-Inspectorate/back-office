import { composeMiddleware } from '@pins/express';
import { param } from 'express-validator';
import { validationErrorHandler } from '../../middleware/error-handler.js';

const validateAppealId = composeMiddleware(
	param('appealId').isInt().withMessage('Appeal id must be a number'),
	validationErrorHandler
);

export { validateAppealId };
