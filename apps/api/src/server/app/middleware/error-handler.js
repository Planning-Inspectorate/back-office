/**
 * @param {Error} error error that requires handling
 * @param {Request} _request API request
 * @param {Response} response API response
 * @param {Function} next next
 * @returns {Response} API Response
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
