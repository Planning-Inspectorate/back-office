import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import { body, query } from 'express-validator';
import multer from 'multer';
import { handleValidationError } from './middleware/handle-validation-error.js';

export const validateGetAllDocuments = composeMiddleware(
	query('type').isIn([
		'appeal',
		'application'
	]).withMessage('Select a valid type'),
	query('id').isInt().toInt().withMessage('Provide appeal/application id'),
	handleValidationError
);

export const validateUploadDocument = composeMiddleware(
	multer({
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 15 * (1024**2)
		}
	}).single('file'),
	mapMulterErrorToValidationError,
	body('file')
		.custom((_, { req }) => Boolean(req.file))
		.withMessage('Select a file'),
	body('documentType').isIn([
		'application'
	]).withMessage('Select a valid document type'),
	body('type').isIn([
		'appeal',
		'application'
	]).withMessage('Select a valid type'),
	body('id').isInt().toInt().withMessage('Provide appeal/application id'),
	handleValidationError
);

export const validateDocumentName = composeMiddleware(
	query('documentName').notEmpty().withMessage('Provide a document name'),
	handleValidationError
);
