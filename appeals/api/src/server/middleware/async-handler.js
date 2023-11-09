/**
 * @template T
 * @param {import('express').RequestHandler<T>| function(): Promise<void>} requestHandler
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
