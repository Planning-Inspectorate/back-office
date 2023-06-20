import { validationResult } from 'express-validator';

/**
 * Evaluate any errors collected by express validation and return a 400 status
 * with the mapped errors.
 *
 * @type {import('express').RequestHandler}
 */
export function handleValidationError(request, response, next) {
	const result = validationResult(request).formatWith(({ msg }) => msg);

	if (!result.isEmpty()) {
		response.status(400).send({ errors: result.mapped() });
	} else {
		next();
	}
}
