import { flatten } from 'lodash-es';

/** @typedef {import('express').ErrorRequestHandler<any>} ErrorRequestHandler */
/** @typedef {import('express').RequestHandler<*, *, *, *, *>} RequestHandler */
/** @typedef {import('express-validator').ValidationChain} ValidationChain */
/** @typedef {ErrorRequestHandler | RequestHandler | (ErrorRequestHandler | RequestHandler)[] | ValidationChain} AnyRequestHandler */

/**
 * Combine multiple express middleware functions into one.
 *
 * @param {...AnyRequestHandler} middleware - A list of express middleware functions.
 * @returns {ErrorRequestHandler | RequestHandler}
 */
export const composeMiddleware = (...middleware) => {
	/** @type {AnyRequestHandler[]} */
	const requestHandlers = flatten(middleware);

	/** @type {ErrorRequestHandler} */
	const handle = (...handlerArguments) => {
		const stack = [...requestHandlers];

		/** @type {ErrorRequestHandler} */
		const goToNextHandler = (error, req, res, done) => {
			const requestHandler = stack.shift();
			const next = (/** @type {*} */ error_) => goToNextHandler(error_, req, res, done);

			if (!requestHandler) {
				done(error);
			} else if (requestHandler.length === 4) {
				if (error) {
					/** @type {ErrorRequestHandler} */ (requestHandler)(error, req, res, next);
				} else {
					goToNextHandler(error, req, res, done);
				}
			} else if (error) {
				goToNextHandler(error, req, res, done);
			} else {
				/** @type {RequestHandler} */ (requestHandler)(req, res, next);
			}
		};

		goToNextHandler(...handlerArguments);
	};

	return requestHandlers[0].length === 4
		? handle
		: /** @type {RequestHandler} */ (req, res, done) => handle(null, req, res, done);
};
