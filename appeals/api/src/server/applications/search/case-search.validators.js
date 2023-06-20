import { composeMiddleware } from '@pins/express';
import { body } from 'express-validator';
import {
	validationErrorHandler,
	validationErrorHandlerUnauthorised
} from '../../middleware/error-handler.js';

export const validateRole = composeMiddleware(
	body('role')
		.isIn(['inspector', 'case-team', 'case-admin-officer'])
		.withMessage('Role is not valid'),
	validationErrorHandlerUnauthorised
);

export const validateSearchCriteria = composeMiddleware(
	body('query').notEmpty().withMessage('Query cannot be blank'),
	body('pageNumber')
		.isInt({ min: 1 })
		.toInt()
		.withMessage('Page Number is not valid')
		.optional({ nullable: true }),
	body('pageSize')
		.isInt({ min: 1 })
		.toInt()
		.withMessage('Page Size is not valid')
		.optional({ nullable: true }),
	validationErrorHandler
);
