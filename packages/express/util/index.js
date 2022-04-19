import { flatten } from 'lodash-es';
import { expressValidatorErrorHandler } from '../middleware/index.js';

/** @typedef {import('express').ErrorRequestHandler<any>} ErrorRequestHandler */
/** @typedef {import('express').RequestHandler<any>} RequestHandler */
/** @typedef {import('express-validator').ValidationChain} ValidationChain */
/** @typedef {ErrorRequestHandler | RequestHandler | RequestHandler[] | ValidationChain} AnyRequestHandler */

/**
 * Combine multiple express middleware functions into one.
 *
 * @param {...AnyRequestHandler} middleware - A list of express middleware functions.
 * @returns {RequestHandler}
 */
export const composeMiddleware = (...middleware) => {
	const requestHandlers = flatten(middleware);

	/** @type {ErrorRequestHandler} */
	const handle = (...args) => {
		const stack = [...requestHandlers];

		/** @type {ErrorRequestHandler} */
		const goToNextFn = (error, req, res, done) => {
			const middlewareFn = stack.shift();
			const next = (/** @type {*} */ err) => goToNextFn(err, req, res, done);

			if (!middlewareFn) {
				done(error);
			} else if (middlewareFn.length === 4) {
				error
					? /** @type {ErrorRequestHandler} */ (middlewareFn)(error, req, res, next)
					: goToNextFn(error, req, res, done);
			} else {
				error
					? goToNextFn(error, req, res, done)
					: /** @type {RequestHandler} */ (middlewareFn)(req, res, next);
			}
		};

		goToNextFn(...args);
	};

	return requestHandlers[0].length === 4
		? (error, req, res, done) => handle(error, req, res, done)
		: (req, res, done) => handle(null, req, res, done);
};

/**
 * Combine multiple express middleware functions into one, and append with the
 * validation handling middleware.
 *
 * @param {...AnyRequestHandler} middleware - An array of express middleware functions.
 * @returns {RequestHandler}
 */
export const createValidator = (...middleware) => {
	return composeMiddleware(...middleware, expressValidatorErrorHandler);
};
