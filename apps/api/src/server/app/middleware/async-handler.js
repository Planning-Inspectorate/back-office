/**
 * @template T
 * @param {import('express').RequestHandler<T>} requestHandler
 * @returns {import('express').RequestHandler<T>}
 */
const asyncHandler = (requestHandler) => (request, response, next) =>
	Promise.resolve(requestHandler(request, response, next))
		// eslint-disable-next-line promise/no-callback-in-promise
		.catch(next);

export default asyncHandler;
