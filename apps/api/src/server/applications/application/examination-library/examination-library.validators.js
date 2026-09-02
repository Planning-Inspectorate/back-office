import { composeMiddleware } from '@pins/express';
import { param, query, body } from 'express-validator';
import { validateExistingApplication } from '../application.validators.js';
import { validationErrorHandler } from '#middleware/error-handler.js';

export const validateApplicationId = composeMiddleware(
	param('id')
		.isInt()
		.withMessage('Application id must be a valid numerical value')
		.toInt()
		.custom(validateExistingApplication)
		.withMessage('Must be an existing application'),
	validationErrorHandler
);

export const validateGetCategories = composeMiddleware(
	query('id').optional().isInt().withMessage('Category id must be a valid numerical value').toInt(),
	query('categoryCode').optional().isString().withMessage('Category code must be a string'),
	validationErrorHandler
);

export const validateCreateCategories = composeMiddleware(
	body().custom((value) => {
		if (!value || typeof value !== 'object') {
			throw new Error('Body must be a category object or array of categories');
		}
		if (Array.isArray(value) && value.length === 0) {
			throw new Error('Categories array cannot be empty');
		}
		return true;
	}),
	body('categoryCode')
		.if(body().isObject().not().isArray())
		.isString()
		.withMessage('Category code is required and must be a string')
		.notEmpty()
		.withMessage('Category code is required and must be a string'),
	body('categoryName')
		.if(body().isObject().not().isArray())
		.isString()
		.withMessage('Category name is required and must be a string')
		.notEmpty()
		.withMessage('Category name is required and must be a string'),
	body('*.categoryCode')
		.if(body().isArray())
		.isString()
		.withMessage('Category code is required and must be a string')
		.notEmpty()
		.withMessage('Category code is required and must be a string'),
	body('*.categoryName')
		.if(body().isArray())
		.isString()
		.withMessage('Category name is required and must be a string')
		.notEmpty()
		.withMessage('Category name is required and must be a string'),
	validationErrorHandler
);

export const validateGetDocuments = composeMiddleware(
	query('categoryCode').optional().isString().withMessage('Category code must be a string'),
	query('publishedStatus').optional().isString().withMessage('Published status must be a string'),
	validationErrorHandler
);
