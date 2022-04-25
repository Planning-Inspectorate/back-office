/**
 * Wrap an asynchronous express middleware such that it catches and handles errors
 * TODO: re-assess in express 5.x
 *
 * @template {object} T
 * @param {import('express').RequestHandler<T>} requestHandler - The asynchronous middleware.
 * @returns {import('express').RequestHandler<T>} - A wrapped request handler.
 */
export const createAsyncHandler = (requestHandler) => (request, response, next) => {
	Promise.resolve(requestHandler(request, response, next)).catch((error) => {
		// eslint-disable-next-line promise/no-callback-in-promise
		next(new AggregateError([new Error('data fetch'), error], 'Fetch errors!'));
	});
};
