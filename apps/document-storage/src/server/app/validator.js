import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import { body, query } from 'express-validator';
import multer from 'multer';
import { handleValidationError } from './middleware/handle-validation-error.js';

export const validateGetAllDocuments = composeMiddleware(
	query('type').isIn(['appeal', 'application']).withMessage('Select a valid type'),
	query('id').isInt().toInt().withMessage('Provide appeal/application id'),
	handleValidationError
);

export const validateUploadDocument = composeMiddleware(
	multer({
		storage: multer.memoryStorage(),
		limits: {
			fileSize: 15 * 1024 ** 2
		}
	}).single('file'),
	mapMulterErrorToValidationError,
	body('file')
		.custom((_, { req }) => Boolean(req.file))
		.withMessage('Select a file'),
	body('documentType').isIn(['application']).withMessage('Select a valid document type'),
	body('type').isIn(['appeal', 'application']).withMessage('Select a valid type'),
	body('id').isInt().toInt().withMessage('Provide appeal/application id'),
	handleValidationError
);

export const validateDocumentName = composeMiddleware(
	query('documentName').notEmpty().withMessage('Provide a document name'),
	handleValidationError
);

export const validateDocumentPath = composeMiddleware(
	body('documentPath').notEmpty().withMessage('Provide a document path'),
	handleValidationError
);

export const validateDocumentInfo = composeMiddleware(
	body('*.caseType')
		.isIn(['appeal', 'application'])
		.withMessage(
			'Please provide a valid caseType. caseType must be either "appeal" or "application"'
		),
	body('*.caseReference')
		.exists()
		.withMessage('Please provide a valid caseReference. caseReference is not the same as ID'),
	body('*.documentName').exists().withMessage('Please provide a valid documentName'),
	body('*.GUID').exists().withMessage('Please provide a valid GUID'),
	body('[]')
		.notEmpty()
		.withMessage('Please enter an object {} with caseRef, documentName, caseType and GUID'),
	handleValidationError
);
