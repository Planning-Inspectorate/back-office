import { validationResult } from 'express-validator';

/**
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
