/**
 * @param error
 * @param req
 * @param request
 * @param _request
 * @param res
 * @param next
 */
function errorHandler(error, _request, response, next) {
	if (response.headersSent) {
		return next(error);
	}
	const code = error.code ? error.code : 500;
	response.status(code);
	return response.send({ error: error.message });
}

export default errorHandler;
