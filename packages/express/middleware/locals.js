/** @returns {import('../types/express').RequestHandler<{}>} */
export const installRequestLocalsMiddleware = () => {
	return (req, _, next) => {
		req.locals = {};
		next();
	};
};
