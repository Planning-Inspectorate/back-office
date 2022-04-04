// @ts-check

/**
 * Wrap an asynchronous express middleware such that it catches and handles errors
 *
 * @param {import('express').RequestHandler<any>} requestHandler - The asynchronous middleware.
 * @returns {import('express').RequestHandler} - A wrapped request handler.
 */
export const createAsyncHandler = (requestHandler) => {
	return (req, res, next) => {
		requestHandler(req, res, next).catch((error) => {
			next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		});
	};
};
