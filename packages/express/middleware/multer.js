import { checkSchema } from 'express-validator';
import { MulterError } from 'multer';

/** @type {import('express').ErrorRequestHandler} */
export const mapMulterErrorToValidationError = async (error, request, _, next) => {
	if (error instanceof MulterError && error.field) {
		await checkSchema({
			[error.field]: {
				custom: {
					errorMessage: error.message
				}
			}
		}).run(request);
		next();
	} else {
		next(error);
	}
};
