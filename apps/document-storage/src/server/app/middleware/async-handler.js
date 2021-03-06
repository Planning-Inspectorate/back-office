/**
 * @template T
 * @param {import('express').RequestHandler<T>} requestHandler request handler
 * @returns {import('express').RequestHandler<T>} request handler
 */
export const asyncHandler = (requestHandler) => (request, response, next) =>
	Promise.resolve(requestHandler(request, response, next))
		.catch(next);
