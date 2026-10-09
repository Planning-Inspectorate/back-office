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
	query('examinationTimetableItemId')
		.optional()
		.isInt({ min: 1 })
		.withMessage('Examination timetable item id must be a positive integer')
		.toInt(),
	query('publishedStatus').optional().isString().withMessage('Published status must be a string'),
	validationErrorHandler
);

export const validateCategoryCode = composeMiddleware(
	body('categoryCode')
		.isString()
		.withMessage('Category code is required and must be a string')
		.notEmpty()
		.withMessage('Category code is required and must be a string'),
	validationErrorHandler
);

export const validatePublishCategory = composeMiddleware(
	body().custom((value) => {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			throw new Error('Payload must be an object');
		}
		if (!value.categoryCode && !value.examinationDocuments) {
			throw new Error('Either categoryCode or examinationDocuments must be provided');
		}
		return true;
	}),
	body('categoryCode')
		.if(body('examinationDocuments').not().exists())
		.isString()
		.withMessage('Category code is required and must be a string')
		.notEmpty()
		.withMessage('Category code is required and must be a string'),
	body('caseReference')
		.if(body('examinationDocuments').exists())
		.isString()
		.withMessage('Case reference is required and must be a string')
		.notEmpty()
		.withMessage('Case reference is required and must be a string'),
	body('examinationDocuments')
		.optional()
		.isArray({ min: 1 })
		.withMessage('Must provide at least one examination document to publish'),
	body('examinationDocuments.*.documentGuid')
		.if(body('examinationDocuments').isArray())
		.isUUID()
		.withMessage('Document GUID must be a valid UUID'),
	body('examinationDocuments.*.documentExaminationReference')
		.if(body('examinationDocuments').isArray())
		.isString()
		.withMessage('Document examination reference is required and must be a string')
		.notEmpty()
		.withMessage('Document examination reference is required and must be a string'),
	body('examinationDocuments.*.categoryCode')
		.if(body('examinationDocuments').isArray())
		.isString()
		.withMessage('Category code is required and must be a string')
		.notEmpty()
		.withMessage('Category code is required and must be a string'),
	body('examinationDocuments.*.categoryName')
		.if(body('examinationDocuments').isArray())
		.isString()
		.withMessage('Category name is required and must be a string')
		.notEmpty()
		.withMessage('Category name is required and must be a string'),
	validationErrorHandler
);

export const validateUnpublishCategory = composeMiddleware(
	body().custom((value) => {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			throw new Error('Payload must be an object');
		}
		if (!value.categoryCode && !value.categories) {
			throw new Error('Either categoryCode or categories must be provided');
		}
		return true;
	}),
	body('categoryCode')
		.if(body('categories').not().exists())
		.isString()
		.withMessage('Category code is required and must be a string')
		.notEmpty()
		.withMessage('Category code is required and must be a string'),
	body('categories')
		.optional()
		.isArray({ min: 1 })
		.withMessage('Categories must be an array with at least one category code'),
	body('categories.*')
		.if(body('categories').isArray())
		.isString()
		.withMessage('Category code must be a string')
		.notEmpty()
		.withMessage('Category code must be a string'),
	body('caseReference')
		.if(body('categories').exists())
		.optional()
		.isString()
		.withMessage('Case reference must be a string'),
	validationErrorHandler
);
