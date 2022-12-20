import { validationResult } from 'express-validator';

/**
 *
 * @param {import('express').Request} request
 * @param {import('express').Response} response
 * @param {import('express').NextFunction} next
 * @param {number} responseCode
 */
const validationError = (request, response, next, responseCode) => {
	const result = validationResult(request).formatWith(({ msg }) => msg);

	if (!result.isEmpty()) {
		response.status(responseCode).send({ errors: result.mapped() });
	} else {
		next();
	}
};

/**
 *
 * @type {import('express').RequestHandler}
 */
export const handleValidationError = (request, response, next) => {
	validationError(request, response, next, 400);
};

/**
 *
 * @type {import('express').RequestHandler}
 */
export const handleMissingValidationError = (request, response, next) => {
	validationError(request, response, next, 404);
};
