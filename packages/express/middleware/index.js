// @ts-check

import { checkSchema, validationResult } from 'express-validator';
import { MulterError } from 'multer';

export const expressValidatorErrorHandler = (request, response, next) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		response.locals.errors = errors.mapped();
	}
	next();
};

/** @type {import('express').ErrorRequestHandler} */
export const mapMulterErrorToValidationError = async (error, request, _, next) => {
	if (error instanceof MulterError) {
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
