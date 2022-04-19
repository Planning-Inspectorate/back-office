/**
 * TODO: re-assess in express 5.x
 * Wrap an asynchronous express middleware such that it catches and handles errors
 *
 * @template {object} T
 * @param {import('express').RequestHandler<T>} requestHandler - The asynchronous middleware.
 * @returns {import('express').RequestHandler<T>} - A wrapped request handler.
 */
export const createAsyncHandler = (requestHandler) => {
	return (req, res, next) => {
		Promise.resolve(requestHandler(req, res, next)).catch((error) => {
			next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
		});
	};
};
