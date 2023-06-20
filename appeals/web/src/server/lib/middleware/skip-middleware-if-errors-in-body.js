/**
 * Conditionally skips execution of the supplied middleware if there are errors present in the body.
 * For example, to prevent a validator from running if a previous validator has failed.
 *
 * @param {import('express').RequestHandler} middleware
 * @returns {import('express').RequestHandler}
 */
export const skipMiddlewareIfErrorsInRequest = (middleware) => {
	return (req, res, next) => {
		if (req?.errors && Object.keys(req?.errors).length > 0) {
			return next();
		}

		middleware(req, res, next);
	};
};
