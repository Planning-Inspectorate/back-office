/**
 * @typedef {function(): Promise<void>} AsyncRequestHandler
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

/**
 * @template T
 * @param {import('express').RequestHandler<T>|AsyncRequestHandler} requestHandler
 * @returns {import('express').RequestHandler<T>}
 */
export const asyncHandler = (requestHandler) => {
	return (request, response, next) => {
		try {
			const p = requestHandler(request, response, next);
			if (p instanceof Promise) {
				p.catch(next);
			}
		} catch (e) {
			// in case a sync function is passed in
			next(e);
		}
	};
};
