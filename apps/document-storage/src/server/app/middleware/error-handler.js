export const errorHandler = function(error, request, response, _next) {
	response.locals.message = error.message;
	response.locals.error = request.app.get('env') === 'development' ? error : {};

	console.error(error);
	response.status(error.status || 500);
	response.send({ 'error': 'Oops! Something went wrong' });
};
