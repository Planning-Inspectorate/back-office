import { validationResult } from 'express-validator';
import { composeMiddleware } from '../utils/compose.js';

/** @typedef {import('express-validator').ValidationError} ValidationError */

/** @type {import('../types/express').RenderHandler<any>} */
const expressValidatorErrorHandler = (request, _, next) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		request.errors = errors.mapped();
	}
	next();
};

/**
 * Combine multiple express middleware functions into one, and append with the
 * validation handling middleware.
 *
 * @param {...import('../utils/compose').AnyRequestHandler} middleware
 * @returns {import('express').RequestHandler<any>}
 */
export const createValidator = (...middleware) => {
	return /** @type {import('express').RequestHandler} */ (
		composeMiddleware(...middleware, expressValidatorErrorHandler)
	);
};
