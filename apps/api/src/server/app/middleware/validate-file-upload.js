import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import multer from 'multer';
import { body } from 'express-validator';
import { handleValidationError } from './handle-validation-error.js';

export const validateFileUpload = function(filename) {
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
		handleValidationError
	);
};
