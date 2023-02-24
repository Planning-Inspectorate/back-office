/**
 * @template T
 * @param {import('express').RequestHandler<T>} requestHandler
 * @returns {import('express').RequestHandler<any, any, any, any, any>}
 */
export const asyncHandler = (requestHandler) => (request, response, next) =>
	Promise.resolve(requestHandler(request, response, next)).catch(next);
