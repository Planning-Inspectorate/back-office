import { composeMiddleware, mapMulterErrorToValidationError } from '@pins/express';
import { body } from 'express-validator';
import multer from 'multer';
import { handleValidationError } from './handle-validation-error.js';

export const validateFileUpload = (/** @type {string | string[] | undefined} */ filename) => {
	return composeMiddleware(
		multer({
			storage: multer.memoryStorage(),
			limits: {
				/* MBs */
				fileSize: 15 * 1024 ** 2
			}
		}).single(filename),
		mapMulterErrorToValidationError,
		body(filename)
			.custom((_, { req }) => Boolean(req.file))
			.withMessage('Select a file'),
		handleValidationError
	);
};
