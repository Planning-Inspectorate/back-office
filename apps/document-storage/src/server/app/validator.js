import multer from 'multer';
import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import { body, query } from 'express-validator';
import { handleValidationError } from './middleware/handle-validation-error.js';

export const validateDocumentUpload = function(filename) {
	return composeMiddleware(
		multer({
			storage: multer.memoryStorage(),
			limits: {
				fileSize: 15 * Math.pow(1024, 2 /* MBs*/)
			}
		}).single(filename),
		mapMulterErrorToValidationError,
		body(filename)
			.custom((_, { req }) => Boolean(req.file))
			.withMessage('Select a file'),
		body('documentType').isIn([
			'application'
		]).withMessage('Select a valid document type'),
		handleValidationError
	);
};

export const validateGetAllDocuments = composeMiddleware(
	query('type').isIn([
		'appeal',
		'application'
	]).withMessage('Select a valid type'),
	query('id').isInt().toInt().withMessage('Provide appeal/application id'),
	handleValidationError
);

export const validateUploadDocument = composeMiddleware(
	query('type').isIn([
		'appeal',
		'application'
	]).withMessage('Select a valid type'),
	query('id').isInt().toInt().withMessage('Provide appeal/application id'),
	handleValidationError
);

export const validateDocumentName = composeMiddleware(
	query('documentName').notEmpty().withMessage('Provide a document name'),
	handleValidationError
);
